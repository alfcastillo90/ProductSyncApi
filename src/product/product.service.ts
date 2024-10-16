
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config'; // Importamos ConfigService para usar las variables de entorno
import axios from 'axios';
import { Product } from './product.schema';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel('Product') private productModel: Model<Product>,
    private readonly configService: ConfigService, // Inyectamos ConfigService
  ) {}

  async fetchProducts() {
    const spaceId = this.configService.get<string>('CONTENTFUL_SPACE_ID');
    const accessToken = this.configService.get<string>('CONTENTFUL_ACCESS_TOKEN');
    const environment = this.configService.get<string>('CONTENTFUL_ENVIRONMENT');
    const contentType = this.configService.get<string>('CONTENTFUL_CONTENT_TYPE');
    
    // Construir la URL dinámica
    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=${contentType}&limit=10`;

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

      // Guardar productos en MongoDB
      await this.productModel.insertMany(products, { ordered: false });
      this.logger.debug('Products successfully saved in MongoDB.');
    } catch (error) {
      this.logger.error('Error fetching or saving products: ', error.message);
    }
  }
}
