import { Product } from "src/modules/product/product.entity";
import { User } from "src/modules/user/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
  JoinColumn,
} from "typeorm";

@Entity("review")
@Index(["user"])
@Index(["product"])
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "userId" })
  userId: string;

  @Column({ name: "productId" })
  productId: string;

  @Column({ type: "int" })
  rating: number; // 1–5 sao

  @Column({ nullable: true })
  comment?: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @ManyToOne(() => User, (u) => u.reviews)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Product, (p) => p.reviews)
  @JoinColumn({ name: "productId" })
  product: Product;
}
