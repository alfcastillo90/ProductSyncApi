import { Schema, Document } from 'mongoose';

export interface Product extends Document {
  sku: string;
  name: string;
  brand: string;
  productModel: string; // Renombramos el campo para evitar conflictos
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
  createdAt: Date;
}

export const ProductSchema = new Schema<Product>({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  productModel: { type: String, required: true }, // Aquí también lo renombramos
  category: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  stock: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
