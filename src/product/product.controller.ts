import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductPostgresService } from './product-postgres.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productPostgresService: ProductPostgresService,
  ) {}

  @ApiOperation({ summary: 'Sync products from Contentful to MongoDB' })
  @Get('sync')
  async syncProducts(): Promise<{ message: string }> {
    await this.productService.fetchProducts(); // Sincroniza con MongoDB
    return { message: 'OK' }; // Devuelve un OK después de ejecutar la función
  }

  @ApiOperation({ summary: 'Sync products from Contentful to PostgreSQL' })
  @Get('sync-postgres')
  async syncProductsPostgres(): Promise<{ message: string }> {
    await this.productPostgresService.fetchAndSaveProductsInPostgres(); // Sincroniza con PostgreSQL
    return { message: 'OK' };
  }
}
