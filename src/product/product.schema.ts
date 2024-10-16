import { Schema, Document } from 'mongoose';

export interface Product extends Document {
  sku: string;
  name: string;
  brand: string;
  productModel: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
  createdAt: Date;
  deletedAt?: Date | null; // Campo para soft delete
}

export const ProductSchema = new Schema<Product>({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  productModel: { type: String, required: true },
  category: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  stock: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }, // Soft delete
});