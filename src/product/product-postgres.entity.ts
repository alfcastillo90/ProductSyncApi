import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductPostgres {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  productModel: string;

  @Column()
  category: string;

  @Column()
  color: string;

  @Column('decimal')
  price: number;

  @Column()
  currency: string;

  @Column('int')
  stock: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Soft delete: Almacena la fecha de eliminación en lugar de eliminar el registro
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
