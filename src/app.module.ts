import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health/health.controller';
import { ProductModule } from './product/product.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPostgres } from './product/product-postgres.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ProductModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST, // Host de PostgreSQL
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432, // Puerto de PostgreSQL
      username: process.env.POSTGRES_USER, // Usuario de PostgreSQL
      password: process.env.POSTGRES_PASSWORD, // Contraseña de PostgreSQL
      database: process.env.POSTGRES_DB, // Base de datos de PostgreSQL
      entities: [ProductPostgres], // Entidades que vamos a utilizar
      synchronize: true, // Sincroniza las entidades con la base de datos
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
