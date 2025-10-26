import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { CouponService } from "./coupon.service";
import {
  CreateCouponDto,
  UpdateCouponDto,
} from "src/modules/coupon/coupon.dto";
import { ApiResponse } from "src/common/response/api-response";

@Controller("coupons")
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCouponDto) {
    const result = await this.couponService.create(dto);
    return ApiResponse.successMessage("Coupon created", result);
  }

  @Get()
  async findAll() {
    const result = await this.couponService.findAll();
    return ApiResponse.success(result);
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const result = await this.couponService.findOne(id);
    return ApiResponse.success(result);
  }

  @Put(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateCouponDto,
  ) {
    const result = await this.couponService.update(id, dto);
    return ApiResponse.successMessage("Coupon updated", result);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.couponService.remove(id);
    return ApiResponse.successMessage("Coupon deleted", null);
  }
}
