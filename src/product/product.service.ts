import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Product } from './product.schema';

@Injectable()
export class ProductService implements OnModuleInit {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel('Product') private productModel: Model<Product>,
    private readonly configService: ConfigService,
  ) {}

  async fetchProducts() {
    const spaceId = this.configService.get<string>('CONTENTFUL_SPACE_ID');
    const accessToken = this.configService.get<string>('CONTENTFUL_ACCESS_TOKEN');
    const environment = this.configService.get<string>('CONTENTFUL_ENVIRONMENT');
    const contentType = this.configService.get<string>('CONTENTFUL_CONTENT_TYPE');

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=${contentType}&limit=20`;

    try {
      const response = await axios.get(url);
      const products = response.data.items.map(item => ({
        sku: item.fields.sku,
        name: item.fields.name,
        brand: item.fields.brand,
        productModel: item.fields.model,
        category: item.fields.category,
        color: item.fields.color,
        price: item.fields.price,
        currency: item.fields.currency,
        stock: item.fields.stock,
        createdAt: item.sys.createdAt,
      }));

      // Insertar productos en MongoDB
      await this.productModel.insertMany(products, { ordered: false });
      this.logger.debug('Products successfully saved in MongoDB.');
    } catch (error) {
      this.logger.error('Error fetching or saving products: ', error.message);
    }
  }

  // Ejecutar fetchProducts cuando el módulo se inicialice
  async onModuleInit() {
    this.logger.debug('Executing initial product sync...');
    await this.fetchProducts(); // Llama a fetchProducts al iniciar el proyecto
  }

  // Cron job que ejecuta fetchProducts cada hora
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('Running cron job: syncing products from Contentful API...');
    await this.fetchProducts();
  }

  async getPaginatedProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;
  
    // Obtener productos no eliminados con paginación
    const [products, total] = await Promise.all([
      this.productModel
        .find({ deletedAt: null }) // Solo productos no eliminados
        .skip(skip)
        .limit(limit),
      this.productModel.countDocuments({ deletedAt: null }),
    ]);
  
    const totalPages = Math.ceil(total / limit);
  
    return {
      products,
      page,
      limit,
      totalPages,
      totalRows: total,
    };
  }

  async deleteProductById(productId: string) {
    const result = await this.productModel.updateOne(
      { _id: productId },
      { deletedAt: new Date() },
    );
  
    if (result.modifiedCount > 0) {
      return { message: 'Product deleted successfully.' };
    } else {
      return { message: 'Product not found or already deleted.' };
    }
  }
  
  async getProductsByPriceRange(minPrice: number, maxPrice: number) {
    const products = await this.productModel
      .find({
        deletedAt: null,
        price: { $gte: minPrice, $lte: maxPrice },
      })
      .exec();
  
    return products;
  }
  
  async getLowStockProducts() {
    const products = await this.productModel
      .find({
        deletedAt: null,
        stock: { $lt: 10 },
      })
      .exec();
  
    return {
      message: `Found ${products.length} products with low stock.`,
      products,
    };
  }
  
  async getProductsByDateRange(startDate: Date, endDate: Date) {
    const products = await this.productModel
      .find({
        deletedAt: null,
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .exec();
  
    return products;
  }
  
}
