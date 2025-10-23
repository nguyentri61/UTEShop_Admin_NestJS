import { Order } from "src/modules/order/order.entity";
import { ProductVariant } from "src/modules/product-variant/product-variant.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from "typeorm";

@Entity("orderItem")
@Index(["order"])
@Index(["variant"])
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // DB columns from Prisma: order_id and variantId
  @Column({ name: "order_id" })
  orderId: string;

  @Column({ name: "variantId" })
  variantId: string;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "float", default: 0 })
  price: number;

  @ManyToOne(() => Order, (o) => o.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" }) // map FK column
  order: Order;

  @ManyToOne(() => ProductVariant, (v) => v.orderItems)
  @JoinColumn({ name: "variantId" }) // map FK column (or change to 'variant_id' if DB uses snake_case)
  variant: ProductVariant;
}
