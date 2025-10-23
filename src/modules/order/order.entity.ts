import { Coupon } from "src/modules/coupon/coupon.entity";
import { OrderItem } from "src/modules/order-item/order-item.entity";
import { User } from "src/modules/user/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";

export enum OrderStatus {
  NEW = "NEW",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  CANCEL_REQUEST = "CANCEL_REQUEST",
}

@Entity("order")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @Column({ type: "float", default: 0 })
  total: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.NEW,
  })
  status: OrderStatus;

  // explicit FK column matching Prisma (userId)
  @Column({ name: "userId" })
  userId: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToMany(() => Coupon, (coupon) => coupon.order)
  coupons: Coupon[];
}
