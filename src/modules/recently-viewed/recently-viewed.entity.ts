import { Product } from "src/modules/product/product.entity";
import { User } from "src/modules/user/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  Column,
  JoinColumn,
} from "typeorm";

@Entity("recently_viewed")
@Index(["user"])
@Index(["product"])
@Index(["viewedAt"])
export class RecentlyViewed {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "userId" })
  userId: string;

  @Column({ name: "productId" })
  productId: string;

  @Column({
    type: "datetime",
    name: "viewedAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  viewedAt: Date;

  @ManyToOne(() => User, (u) => u.recentlyViewed, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Product, (p) => p.recentlyViewed, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product: Product;
}
