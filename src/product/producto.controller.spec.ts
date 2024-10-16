import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductPostgresService } from './product-postgres.service';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;
  let productPostgresService: ProductPostgresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            fetchProducts: jest.fn().mockResolvedValue(undefined), // Mock de la función fetchProducts
          },
        },
        {
          provide: ProductPostgresService,
          useValue: {
            fetchAndSaveProductsInPostgres: jest.fn().mockResolvedValue(undefined), // Mock de la función fetchAndSaveProductsInPostgres
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
    productPostgresService = module.get<ProductPostgresService>(ProductPostgresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return OK after syncing products with MongoDB', async () => {
    // Ejecutamos el controlador que llama a fetchProducts
    const result = await controller.syncProducts();
    expect(result).toEqual({ message: 'OK' }); // Verificamos que devuelve OK
    expect(productService.fetchProducts).toHaveBeenCalled(); // Verificamos que se llamó a fetchProducts
  });

  it('should return OK after syncing products with PostgreSQL', async () => {
    // Ejecutamos el controlador que llama a fetchAndSaveProductsInPostgres
    const result = await controller.syncProductsPostgres();
    expect(result).toEqual({ message: 'OK' }); // Verificamos que devuelve OK
    expect(productPostgresService.fetchAndSaveProductsInPostgres).toHaveBeenCalled(); // Verificamos que se llamó a fetchAndSaveProductsInPostgres
  });
});
