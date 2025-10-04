import { Order } from "src/modules/order/order.entity";
import { ProductVariant } from "src/modules/product-variant/product-variant.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from "typeorm";

@Entity("order_item")
@Index(["order"])
@Index(["variant"])
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "float", default: 0 })
  price: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  order: Order;

  @ManyToOne(() => ProductVariant, (variant) => variant.orderItems, {
    onDelete: "CASCADE",
  })
  variant: ProductVariant;
}
