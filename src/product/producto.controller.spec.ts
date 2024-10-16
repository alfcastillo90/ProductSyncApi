import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

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
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return OK after syncing products', async () => {
    // Ejecutamos el controlador que llama a fetchProducts
    const result = await controller.syncProducts();
    expect(result).toEqual({ message: 'OK' }); // Verificamos que devuelve OK
    expect(productService.fetchProducts).toHaveBeenCalled(); // Verificamos que se llamó a fetchProducts
  });
});
