import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ApiResponse } from "src/common/response/api-response";
import { Product } from "./product.entity";

@Controller("products")
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  async getAll(): Promise<ApiResponse<Product[]>> {
    const items = await this.service.findAll();
    return ApiResponse.success(items);
  }

  @Get(":id")
  async getOne(@Param("id") id: string): Promise<ApiResponse<Product>> {
    const item = await this.service.findOne(id);
    return ApiResponse.success(item);
  }

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<ApiResponse<Product>> {
    const created = await this.service.create(dto);
    return ApiResponse.success(created);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ApiResponse<Product>> {
    const updated = await this.service.update(id, dto);
    return ApiResponse.success(updated);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    await this.service.remove(id);
  }
}
