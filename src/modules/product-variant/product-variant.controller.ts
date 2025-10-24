import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ProductVariantService } from "./product-variant.service";
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from "./dto/product-variant-dto";
import { ApiResponse } from "src/common/response/api-response";

@Controller("product-variants")
export class ProductVariantController {
  constructor(private readonly variantService: ProductVariantService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProductVariantDto) {
    const res = await this.variantService.create(dto);
    return ApiResponse.successMessage("Variant created", res);
  }

  @Get()
  async findAll() {
    const res = await this.variantService.findAll();
    return ApiResponse.success(res);
  }

  @Get("product/:productId")
  async findByProduct(@Param("productId", ParseUUIDPipe) productId: string) {
    const res = await this.variantService.findByProduct(productId);
    return ApiResponse.success(res);
  }

  @Get("product/:productId/sizes")
  async getAvailableSizes(
    @Param("productId", ParseUUIDPipe) productId: string,
  ) {
    const res = await this.variantService.getAvailableSizes(productId);
    return ApiResponse.success(res);
  }

  @Get("product/:productId/colors")
  async getAvailableColors(
    @Param("productId", ParseUUIDPipe) productId: string,
    @Query("size") size?: string,
  ) {
    const res = await this.variantService.getAvailableColors(productId, size);
    return ApiResponse.success(res);
  }

  @Get("find-by-attributes")
  async findByAttributes(
    @Query("productId", ParseUUIDPipe) productId: string,
    @Query("size") size: string,
    @Query("color") color: string,
  ) {
    const res = await this.variantService.findByAttributes(
      productId,
      size,
      color,
    );
    return ApiResponse.success(res);
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const res = await this.variantService.findOne(id);
    return ApiResponse.success(res);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductVariantDto,
  ) {
    const res = await this.variantService.update(id, dto);
    return ApiResponse.successMessage("Variant updated", res);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.variantService.remove(id);
    return ApiResponse.successMessage("Variant deleted", null);
  }

  @Patch(":id/stock")
  async updateStock(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("quantity") quantity: number,
  ) {
    const res = await this.variantService.updateStock(id, Number(quantity));
    return ApiResponse.successMessage("Stock updated", res);
  }

  @Get(":id/check-stock")
  async checkStock(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("quantity") quantity: number,
  ) {
    const res = await this.variantService.checkStock(id, Number(quantity));
    return ApiResponse.success(res);
  }
}
