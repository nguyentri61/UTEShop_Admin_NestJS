import { Product } from "src/modules/product/product.entity";
import { User } from "src/modules/user/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  Index,
  JoinColumn,
  Column,
} from "typeorm";

@Entity("favorite")
@Unique(["user", "product"])
@Index(["user"])
@Index(["product"])
export class Favorite {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "userId" })
  userId: string;

  @Column({ name: "productId" })
  productId: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Product, (p) => p.favorites, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product: Product;
}
