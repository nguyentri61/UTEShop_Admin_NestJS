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
@Index(["product"])
export class ProductVariant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "productId" })
  productId: string;

  @ManyToOne(() => Product, (p) => p.variants)
  @JoinColumn({ name: "productId" })
  product: Product;

  @OneToMany(() => OrderItem, (oi) => oi.variant)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (c) => c.variant)
  cartItems: CartItem[];
}
