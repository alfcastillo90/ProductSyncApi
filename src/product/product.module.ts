import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './product.schema';
import { ProductService } from './product.service';
import { ProductController } from './product.controller'; // Importamos el controlador
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPostgres } from './product-postgres.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    TypeOrmModule.forFeature([ProductPostgres]),
  ],
  providers: [ProductService],
  controllers: [ProductController], // Registramos el controlador
})
export class ProductModule {}
