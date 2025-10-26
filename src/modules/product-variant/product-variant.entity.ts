import { CartItem } from "src/modules/cart-item/cart-item.entity";
import { OrderItem } from "src/modules/order-item/order-item.entity";
import { Product } from "src/modules/product/product.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from "typeorm";

@Entity("productVariant")
@Index(["productId"])
export class ProductVariant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (p) => p.variants, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  size?: string;

  @Column("int", { default: 0 })
  stock: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  discountPrice?: number;

  @OneToMany(() => OrderItem, (oi) => oi.variant)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (c) => c.variant)
  cartItems: CartItem[];
}
