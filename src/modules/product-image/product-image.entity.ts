import { Product } from "src/modules/product/product.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from "typeorm";

@Entity("product_image")
@Index(["product"])
export class ProductImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  url: string;

  @ManyToOne(() => Product, (product) => product.productImage, {
    onDelete: "CASCADE",
  })
  product: Product;
}
