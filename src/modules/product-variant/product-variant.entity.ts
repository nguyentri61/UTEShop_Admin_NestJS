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
} from "typeorm";

@Entity("product_variant")
@Index(["product"])
export class ProductVariant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  size?: string;

  @Column({ type: "int" })
  stock: number;

  @Column({ type: "float" })
  price: number;

  @Column({ type: "float", nullable: true })
  discountPrice?: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: "CASCADE",
  })
  product: Product;

  @OneToMany(() => CartItem, (cartItem) => cartItem.variant)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.variant)
  orderItems: OrderItem[];
}
