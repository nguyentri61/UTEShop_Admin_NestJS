import { Product } from "src/modules/product/product.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from "typeorm";

@Entity("productImage")
@Index(["product"])
export class ProductImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  url: string;

  @Column({ name: "productId" })
  productId: string;

  @ManyToOne(() => Product, (p) => p.productImage)
  @JoinColumn({ name: "productId" })
  product: Product;
}
