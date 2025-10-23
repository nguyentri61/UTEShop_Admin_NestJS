import { ProductVariant } from "src/modules/product-variant/product-variant.entity";
import { User } from "src/modules/user/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  Index,
  JoinColumn,
} from "typeorm";

@Entity("cart_item")
@Unique(["user", "variant"])
@Index(["user"])
@Index(["variant"])
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "userId" })
  userId: string;

  @Column({ name: "variantId" })
  variantId: string;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => ProductVariant, (v) => v.cartItems)
  @JoinColumn({ name: "variantId" })
  variant: ProductVariant;
}
