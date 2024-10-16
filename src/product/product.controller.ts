import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Sync products from Contentful' })
  @Get('sync')
  async syncProducts(): Promise<{ message: string }> {
    await this.productService.fetchProducts();
    return { message: 'OK' }; // Devuelve un OK después de ejecutar la función
  }
}
