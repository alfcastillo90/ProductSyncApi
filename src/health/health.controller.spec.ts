import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('HealthController', () => {
  let controller: HealthController;
  let mockConnection: Partial<Connection>;

  beforeEach(async () => {
    // Crear un mock de la conexión a MongoDB
    mockConnection = {
      readyState: 1, // Simulamos que MongoDB está conectado
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: getConnectionToken(), // Utilizamos el token correcto para la conexión
          useValue: mockConnection,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return healthy when MongoDB is connected', async () => {
    // Simulamos que MongoDB está conectado
    const result = await controller.check();
    expect(result).toEqual({ status: 'Healthy', dbState: 1 });
  });
});
