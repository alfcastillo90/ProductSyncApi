import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductPostgres } from './product-postgres.entity';

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
