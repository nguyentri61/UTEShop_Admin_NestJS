import { Product } from "src/modules/product/product.entity";
import { User } from "src/modules/user/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  Index,
} from "typeorm";

@Entity("favorite")
@Unique(["user", "product"])
@Index(["user"])
@Index(["product"])
export class Favorite {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Product, (product) => product.favorites, {
    onDelete: "CASCADE",
  })
  product: Product;
}
