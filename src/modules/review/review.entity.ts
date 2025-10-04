import { Product } from "src/modules/product/product.entity";
import { User } from "src/modules/user/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from "typeorm";

@Entity("review")
@Index(["user"])
@Index(["product"])
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  rating: number; // 1–5 sao

  @Column({ nullable: true, type: "text" })
  comment?: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: "CASCADE",
  })
  product: Product;
}
