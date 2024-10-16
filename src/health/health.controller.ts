import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  async check() {
    const state = this.connection.readyState;
    return {
      status: state === 1 ? 'Healthy' : 'Unhealthy',
      dbState: state,
    };
  }
}
