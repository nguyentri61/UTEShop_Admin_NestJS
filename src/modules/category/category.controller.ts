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
import { CategoryService } from "./category.service";
import { ApiResponse } from "src/common/response/api-response";
import {
  CategoryResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "./dto/category-dto";

@Controller("categories")
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  async getAll(): Promise<ApiResponse<CategoryResponse[]>> {
    const items = await this.service.findAll();
    return ApiResponse.success(items);
  }

  @Get(":id")
  async getOne(
    @Param("id") id: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    const item = await this.service.findOne(id);
    return ApiResponse.success(item);
  }

  @Post()
  async create(
    @Body() dto: CreateCategoryDto,
  ): Promise<ApiResponse<CategoryResponse>> {
    const created = await this.service.create(dto);
    return ApiResponse.success(created);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<ApiResponse<CategoryResponse>> {
    const updated = await this.service.update(id, dto);
    return ApiResponse.success(updated);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string): Promise<void> {
    await this.service.remove(id);
  }
}
