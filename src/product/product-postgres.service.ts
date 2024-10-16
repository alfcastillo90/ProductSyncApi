import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductPostgres } from './product-postgres.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class ProductPostgresService implements OnModuleInit {
  private readonly logger = new Logger(ProductPostgresService.name);

  constructor(
    @InjectRepository(ProductPostgres)
    private productRepository: Repository<ProductPostgres>,
    private readonly configService: ConfigService,
  ) {}

  // Método para obtener y guardar productos desde Contentful en PostgreSQL
  async fetchAndSaveProductsInPostgres() {
    try {
      const contentfulUrl = `https://cdn.contentful.com/spaces/${this.configService.get(
        'CONTENTFUL_SPACE_ID',
      )}/environments/${this.configService.get(
        'CONTENTFUL_ENVIRONMENT',
      )}/entries?access_token=${this.configService.get(
        'CONTENTFUL_ACCESS_TOKEN',
      )}&content_type=${this.configService.get('CONTENTFUL_CONTENT_TYPE')}`;

      const response = await axios.get(contentfulUrl);
      const items = response.data.items;

      // Mapear y guardar productos en PostgreSQL
      for (const item of items) {
        const productData = item.fields;
        const product = this.productRepository.create({
          sku: productData.sku,
          name: productData.name,
          brand: productData.brand,
          productModel: productData.model,
          category: productData.category,
          color: productData.color,
          price: productData.price,
          currency: productData.currency,
          stock: productData.stock,
        });

        await this.productRepository.save(product);
      }

      this.logger.debug('Products fetched and saved successfully in PostgreSQL.');
    } catch (error) {
      this.logger.error('Error fetching or saving products:', error);
    }
  }

  // Obtener productos paginados
  async getPaginatedProducts(page: number = 1, limit: number = 5) {
    const [result, total] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: result,
      page,
      limit,
      totalPages,
      total,
    };
  }

  // Eliminar producto por ID (soft delete)
  async deleteProductById(id: string) {
    const product = await this.productRepository.findOneBy({ id: parseInt(id) });
    if (product) {
      product.deletedAt = new Date();
      await this.productRepository.save(product);
      return { message: `Product with id ${id} has been soft deleted.` };
    }
    return { message: `Product with id ${id} not found.` };
  }

  // Obtener productos por rango de precio
  async getProductsByPriceRange(minPrice: number = 0, maxPrice: number = 1000) {
    return this.productRepository.find({
      where: {
        price: Between(minPrice, maxPrice),
        deletedAt: null,
      },
    });
  }

  // Obtener productos por rango de fecha
  async getProductsByDateRange(startDate: Date, endDate: Date) {
    return this.productRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
        deletedAt: null,
      },
    });
  }

  // Obtener productos con poco stock
  async getLowStockProducts() {
    return this.productRepository.find({
      where: {
        stock: LessThanOrEqual(10),
        deletedAt: null,
      },
    });
  }

  // Ejecutar la sincronización de productos al iniciar el módulo
  async onModuleInit() {
    this.logger.debug('Executing product sync on module init...');
    await this.fetchAndSaveProductsInPostgres();
  }

  // Cron job que ejecuta la sincronización cada hora
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('Running cron job: syncing products...');
    await this.fetchAndSaveProductsInPostgres();
  }
}
