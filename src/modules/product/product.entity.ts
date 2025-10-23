import { Category } from "src/modules/category/category.entity";
import { Favorite } from "src/modules/favorite/favorite.entity";
import { ProductImage } from "src/modules/product-image/product-image.entity";
import { ProductVariant } from "src/modules/product-variant/product-variant.entity";
import { RecentlyViewed } from "src/modules/recently-viewed/recently-viewed.entity";
import { Review } from "src/modules/review/review.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Index,
  JoinColumn,
} from "typeorm";

@Entity("product")
@Index(["category"])
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: "text" })
  description?: string;

  @Column({ type: "float" })
  price: number;

  @Column({ type: "float", nullable: true })
  discountPrice?: number;

  @Column({ type: "int" })
  stock: number;

  @Column({ type: "int", default: 0 })
  viewCount: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @Column({ name: "categoryId" })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.product)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @OneToMany(() => ProductImage, (img) => img.product)
  productImage: ProductImage[];

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => Favorite, (fav) => fav.product)
  favorites: Favorite[];

  @OneToMany(() => RecentlyViewed, (rv) => rv.product)
  recentlyViewed: RecentlyViewed[];
}
