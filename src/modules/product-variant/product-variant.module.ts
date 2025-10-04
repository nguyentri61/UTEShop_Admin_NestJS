import { Module } from "@nestjs/common";
import { ProductVariantService } from "./product-variant.service";
import { ProductVariantController } from "./product-variant.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductVariant } from "src/modules/product-variant/product-variant.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant])],
  providers: [ProductVariantService],
  controllers: [ProductVariantController],
})
export class ProductVariantModule {}
