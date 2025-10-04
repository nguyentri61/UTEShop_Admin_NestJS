import { Product } from "src/modules/product/product.entity";
import { User } from "src/modules/user/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
} from "typeorm";

@Entity("recently_viewed")
@Index(["user"])
@Index(["product"])
@Index(["viewedAt"])
export class RecentlyViewed {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ type: "datetime" })
  viewedAt: Date;

  @ManyToOne(() => User, (user) => user.recentlyViewed, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Product, (product) => product.recentlyViewed, {
    onDelete: "CASCADE",
  })
  product: Product;
}
