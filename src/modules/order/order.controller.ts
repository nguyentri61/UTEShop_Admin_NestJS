import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { UpdateOrderStatusDto } from "./dto/order-dto";
import { ApiResponse } from "src/common/response/api-response";

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll() {
    const result = await this.orderService.findAll();
    return ApiResponse.success(result);
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const result = await this.orderService.findOne(id);
    return ApiResponse.success(result);
  }

  @Put(":id/status")
  async updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const result = await this.orderService.updateStatus(id, dto);
    return ApiResponse.successMessage("Order status updated", result);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.orderService.remove(id);
    return ApiResponse.successMessage("Order deleted", null);
  }
}
