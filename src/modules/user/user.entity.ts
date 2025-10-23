import { CartItem } from "src/modules/cart-item/cart-item.entity";
import { Coupon } from "src/modules/coupon/coupon.entity";
import { Favorite } from "src/modules/favorite/favorite.entity";
import { Order } from "src/modules/order/order.entity";
import { RecentlyViewed } from "src/modules/recently-viewed/recently-viewed.entity";
import { Review } from "src/modules/review/review.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  otp?: string;

  @Column({ nullable: true, type: "datetime" })
  otpExpiry?: Date;

  @Column({ default: false })
  verified: boolean;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: false })
  blocked: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => CartItem, (cart) => cart.user)
  cart: CartItem[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Coupon, (coupon) => coupon.user)
  coupons: Coupon[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => RecentlyViewed, (rv) => rv.user)
  recentlyViewed: RecentlyViewed[];
}
