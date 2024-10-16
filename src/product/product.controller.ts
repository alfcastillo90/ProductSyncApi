import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductPostgresService } from './product-postgres.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Products MongoDB')
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

  @ApiTags('Products Postgres')
  @ApiOperation({ summary: 'Sync products from Contentful to PostgreSQL' })
  @Get('sync-postgres')
  async syncProductsPostgres(): Promise<{ message: string }> {
    await this.productPostgresService.fetchAndSaveProductsInPostgres(); // Sincroniza con PostgreSQL
    return { message: 'OK' };
  }

  @ApiOperation({ summary: 'Get paginated products' })
  @Get()
  async getPaginatedProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.productService.getPaginatedProducts(page, limit);
  }

  @ApiOperation({ summary: 'Delete product by ID' })
  @Delete(':id')
  async deleteProductById(@Param('id') id: string) {
    return this.productService.deleteProductById(id);
  }

  @ApiOperation({ summary: 'Get products by price range' })
  @Get('price-range')
  async getProductsByPriceRange(
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ) {
    return this.productService.getProductsByPriceRange(minPrice, maxPrice);
  }

  @ApiOperation({ summary: 'Get products by date range' })
  @Get('date-range')
  async getProductsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.productService.getProductsByDateRange(new Date(startDate), new Date(endDate));
  }

  @ApiOperation({ summary: 'Get products with low stock' })
  @Get('low-stock')
  async getLowStockProducts() {
    return this.productService.getLowStockProducts();
  }
}
