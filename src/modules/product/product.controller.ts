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
import { ProductService } from "./product.service";
import {
  CreateProductDto,
  QueryProductDto,
  UpdateProductDto,
} from "src/modules/product/dto/product-dto";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Get("top-viewed")
  getTopViewed(@Query("limit") limit?: number) {
    return this.productService.getTopViewed(limit);
  }

  @Get("newest")
  getNewest(@Query("limit") limit?: number) {
    return this.productService.getNewestProducts(limit);
  }

  @Get("discounted")
  getDiscounted() {
    return this.productService.getDiscountedProducts();
  }

  @Get("category/:categoryId")
  findByCategory(
    @Param("categoryId", ParseUUIDPipe) categoryId: string,
    @Query() query: QueryProductDto,
  ) {
    return this.productService.findByCategory(categoryId, query);
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    // Increment view count
    await this.productService.incrementViewCount(id);
    return this.productService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }

  @Patch(":id/stock")
  updateStock(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("quantity") quantity: number,
  ) {
    return this.productService.updateStock(id, quantity);
  }

  @Get(":id/check-stock")
  checkStock(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("quantity") quantity: number,
  ) {
    return this.productService.checkStock(id, quantity);
  }
}
