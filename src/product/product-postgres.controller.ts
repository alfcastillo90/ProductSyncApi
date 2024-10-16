import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ProductPostgresService } from './product-postgres.service';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Products PostgresSQL')
@Controller('products-postgres')
export class ProductPostgresController {
  constructor(private readonly productPostgresService: ProductPostgresService) {}

  @ApiOperation({ summary: 'Sync products from Contentful to PostgreSQL' })
  @Get('sync')
  async syncProductsPostgres(): Promise<{ message: string }> {
    await this.productPostgresService.fetchAndSaveProductsInPostgres(); // Sincroniza con PostgreSQL
    return { message: 'OK' };
  }

  @ApiOperation({ summary: 'Get paginated products' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 5 })
  @Get()
  async getPaginatedProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.productPostgresService.getPaginatedProducts(page, limit);
  }

  @ApiOperation({ summary: 'Delete product by ID' })
  @Delete(':id')
  async deleteProductById(@Param('id') id: string) {
    return this.productPostgresService.deleteProductById(id);
  }

  @ApiOperation({ summary: 'Get products by price range' })
  @ApiQuery({ name: 'minPrice', required: true, example: 100 })
  @ApiQuery({ name: 'maxPrice', required: true, example: 1000 })
  @Get('price-range')
  async getProductsByPriceRange(
    @Query('minPrice') minPrice: number = 0,
    @Query('maxPrice') maxPrice: number = 1000,
  ) {
    return this.productPostgresService.getProductsByPriceRange(minPrice, maxPrice);
  }

  @ApiOperation({ summary: 'Get products by date range' })
  @ApiQuery({ name: 'startDate', required: true, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: true, example: '2024-12-31' })
  @Get('date-range')
  async getProductsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.productPostgresService.getProductsByDateRange(new Date(startDate), new Date(endDate));
  }

  @ApiOperation({ summary: 'Get products with low stock' })
  @Get('low-stock')
  async getLowStockProducts() {
    return this.productPostgresService.getLowStockProducts();
  }
}
