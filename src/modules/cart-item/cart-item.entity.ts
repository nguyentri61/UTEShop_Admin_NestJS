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
} from "typeorm";

@Entity("cart_item")
@Unique(["user", "variant"])
@Index(["user"])
@Index(["variant"])
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.cart, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => ProductVariant, (variant) => variant.cartItems, {
    onDelete: "CASCADE",
  })
  variant: ProductVariant;
}
