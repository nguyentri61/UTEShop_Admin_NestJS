import { Module } from "@nestjs/common";
import { OrderItemService } from "./order-item.service";
import { OrderItemController } from "./order-item.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItem } from "src/modules/order-item/order-item.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  providers: [OrderItemService],
  controllers: [OrderItemController],
})
export class OrderItemModule {}
