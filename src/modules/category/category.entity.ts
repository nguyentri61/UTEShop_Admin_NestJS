import { Product } from "src/modules/product/product.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";

@Entity("category")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon?: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];
}
