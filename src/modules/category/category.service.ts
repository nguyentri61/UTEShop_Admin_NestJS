import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import {
  CategoryResponse,
  UpdateCategoryDto,
  CreateCategoryDto,
} from "./dto/category-dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async findAll(): Promise<CategoryResponse[]> {
    const categories = await this.repo.find();
    return categories.map((c) => this.toResponse(c));
  }

  async findOne(id: string): Promise<CategoryResponse> {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException("Category not found");
    return this.toResponse(category);
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponse> {
    const category = this.repo.create(dto);
    const saved = await this.repo.save(category);
    return this.toResponse(saved);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponse> {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException("Category not found");
    Object.assign(category, dto);
    const saved = await this.repo.save(category);
    return this.toResponse(saved);
  }

  async remove(id: string): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException("Category not found");
  }

  private toResponse(category: Category): CategoryResponse {
    return new CategoryResponse({
      id: category.id,
      name: category.name,
      icon: category.icon,
      createdAt: category.createdAt,
    });
  }
}
