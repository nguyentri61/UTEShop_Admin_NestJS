import { Order } from "src/modules/order/order.entity";
import { User } from "src/modules/user/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from "typeorm";

export enum CouponType {
  SHIPPING = "SHIPPING",
  PRODUCT = "PRODUCT",
}

@Entity("coupon")
@Index(["user"])
@Index(["order"])
export class Coupon {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  code: string;

  @Column({ type: "enum", enum: CouponType, default: CouponType.PRODUCT })
  type: CouponType;

  @Column()
  description: string;

  @Column({ type: "float" })
  discount: number;

  @Column({ type: "float" })
  minOrderValue: number;

  @Column({ type: "datetime" })
  expiredAt: Date;

  @ManyToOne(() => Order, (order) => order.coupons, {
    nullable: true,
    onDelete: "SET NULL",
  })
  order?: Order;

  @ManyToOne(() => User, (user) => user.coupons, {
    nullable: true,
    onDelete: "SET NULL",
  })
  user?: User;
}
