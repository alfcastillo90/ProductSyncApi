import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

jest.mock('axios');

describe('ProductService', () => {
  let service: ProductService;
  let productModel: Model<any>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken('Product'),
          useValue: {
            insertMany: jest.fn(), // Mock de la función insertMany de Mongoose
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'CONTENTFUL_SPACE_ID':
                  return '9xs1613l9f7v';
                case 'CONTENTFUL_ACCESS_TOKEN':
                  return 'I-ThsT55eE_B3sCUWEQyDT4VqVO3x__20ufuie9usns';
                case 'CONTENTFUL_ENVIRONMENT':
                  return 'master';
                case 'CONTENTFUL_CONTENT_TYPE':
                  return 'product';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productModel = module.get<Model<any>>(getModelToken('Product'));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch products and save them to the database', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        items: [
          {
            fields: {
              sku: '123',
              name: 'Test Product',
              brand: 'Brand X',
              model: 'Model Y',
              category: 'Category Z',
              color: 'Black',
              price: 99.99,
              currency: 'USD',
              stock: 10,
            },
            sys: {
              createdAt: '2024-01-23T21:47:08.012Z',
            },
          },
        ],
      },
    });

    await service.fetchProducts();

    expect(axios.get).toHaveBeenCalled();
    expect(productModel.insertMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sku: '123',
          name: 'Test Product',
          brand: 'Brand X',
          productModel: 'Model Y',
          category: 'Category Z',
          color: 'Black',
          price: 99.99,
          currency: 'USD',
          stock: 10,
          createdAt: '2024-01-23T21:47:08.012Z',
        }),
      ]),
      { ordered: false }
    );
  });

  it('should call fetchProducts on module init', async () => {
    const fetchProductsSpy = jest.spyOn(service, 'fetchProducts').mockResolvedValue();

    await service.onModuleInit();

    expect(fetchProductsSpy).toHaveBeenCalled();
  });
});
