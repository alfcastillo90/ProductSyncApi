import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection as MongooseConnection } from 'mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Connection as TypeOrmConnection } from 'typeorm';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly mongoConnection: MongooseConnection,
    private readonly postgresConnection: TypeOrmConnection,
  ) {}

  @ApiOperation({ summary: 'Check MongoDB and PostgreSQL connection health' })
  @Get()
  async check() {
    // Estado de MongoDB
    const mongoState = this.mongoConnection.readyState;
    const mongoStatus = mongoState === 1 ? 'Healthy' : 'Unhealthy';

    // Estado de PostgreSQL
    const postgresStatus = this.postgresConnection.isConnected ? 'Healthy' : 'Unhealthy';

    return {
      mongoDB: {
        status: mongoStatus,
        dbState: mongoState,
      },
      postgres: {
        status: postgresStatus,
        isConnected: this.postgresConnection.isConnected,
      },
    };
  }
}
