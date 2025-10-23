import {
  Controller,
  Get,
  Patch,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { ApiResponse } from "src/common/response/api-response";
import { Order } from "./order.entity";

@Controller("orders")
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Get()
  async getAll(): Promise<ApiResponse<Order[]>> {
    const items = await this.service.findAll();
    return ApiResponse.success(items);
  }

  @Get(":id")
  async getOne(@Param("id") id: string): Promise<ApiResponse<Order>> {
    const item = await this.service.findOne(id);
    return ApiResponse.success(item);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<ApiResponse<Order>> {
    const updated = await this.service.update(id, dto);
    return ApiResponse.success(updated);
  }

  @Patch(":id/status")
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<ApiResponse<Order>> {
    const updated = await this.service.updateStatus(id, dto.status);
    return ApiResponse.success(updated);
  }
}
