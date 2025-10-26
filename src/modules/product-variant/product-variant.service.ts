import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductVariant } from "./product-variant.entity";
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
  ProductVariantDetailResponseDto,
  ProductVariantListResponseDto,
  AvailableOptionsResponseDto,
} from "./dto/product-variant-dto";

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant) private repo: Repository<ProductVariant>,
  ) {}

  async create(dto: CreateProductVariantDto) {
    const product = await this.repo.manager.findOne("product", {
      where: { id: dto.productId },
    });
    if (!product) throw new BadRequestException("Product not found");

    const exist = await this.repo.findOne({
      where: {
        productId: dto.productId,
        size: dto.size,
        color: dto.color,
      },
    });
    if (exist)
      throw new BadRequestException("Variant with same attributes exists");

    const variant = this.repo.create(dto);
    const saved = await this.repo.save(variant);

    const full = await this.repo.findOne({
      where: { id: saved.id },
      relations: ["product"],
    });

    if (!full) {
      throw new NotFoundException(
        `Variant with ID ${saved.id} not found after create`,
      );
    }

    return this.toResponse(full);
  }

  async findAll() {
    const items = await this.repo.find({
      relations: ["product"],
    });
    return items.map((i) => this.toListResponse(i));
  }

  async findByProduct(productId: string) {
    const items = await this.repo.find({
      where: { productId },
      relations: ["product"],
      order: { size: "ASC", color: "ASC" },
    });
    return items.map((i) => this.toListResponse(i));
  }

  async findOne(id: string) {
    const variant = await this.repo.findOne({
      where: { id },
      relations: ["product"],
    });
    if (!variant) throw new NotFoundException(`Variant ${id} not found`);
    return this.toResponse(variant);
  }

  async findByAttributes(productId: string, size: string, color: string) {
    const variant = await this.repo.findOne({
      where: { productId, size, color },
      relations: ["product"],
    });
    if (!variant)
      throw new NotFoundException(
        "Variant not found with specified attributes",
      );
    return this.toResponse(variant);
  }

  async update(id: string, dto: UpdateProductVariantDto) {
    const variant = await this.repo.findOne({ where: { id } });
    if (!variant) throw new NotFoundException(`Variant ${id} not found`);

    if (dto.size || dto.color) {
      const size = dto.size ?? variant.size;
      const color = dto.color ?? variant.color;
      const dup = await this.repo.findOne({
        where: { productId: variant.productId, size, color },
      });
      if (dup && dup.id !== id)
        throw new BadRequestException("Duplicate variant");
    }

    Object.assign(variant, dto);
    await this.repo.save(variant);
    return this.findOne(id);
  }

  async remove(id: string) {
    const variant = await this.repo.findOne({ where: { id } });
    if (!variant) throw new NotFoundException(`Variant ${id} not found`);
    await this.repo.remove(variant);
  }

  async updateStock(id: string, quantity: number) {
    const variant = await this.repo.findOne({ where: { id } });
    if (!variant) throw new NotFoundException(`Variant ${id} not found`);

    if (variant.stock + quantity < 0)
      throw new BadRequestException("Insufficient stock");

    variant.stock += quantity;
    await this.repo.save(variant);
    return this.findOne(id);
  }

  async checkStock(id: string, quantity: number) {
    const variant = await this.repo.findOne({ where: { id } });
    if (!variant) throw new NotFoundException(`Variant ${id} not found`);
    return {
      available: variant.stock >= quantity,
      stock: variant.stock,
    };
  }

  async getAvailableSizes(productId: string) {
    const rows = await this.repo.find({
      where: { productId },
      select: ["size"],
    });
    return [...new Set(rows.map((r) => r.size))].sort();
  }

  async getAvailableColors(productId: string, size?: string) {
    const where: any = { productId };
    if (size) where.size = size;
    const rows = await this.repo.find({ where, select: ["color"] });
    return [...new Set(rows.map((r) => r.color))].sort();
  }

  async getAvailableOptions(productId: string) {
    const [sizes, colors] = await Promise.all([
      this.getAvailableSizes(productId),
      this.getAvailableColors(productId),
    ]);
    return { sizes, colors };
  }

  private toResponse(variant: ProductVariant): ProductVariantDetailResponseDto {
    return new ProductVariantDetailResponseDto({
      id: variant.id,
      productId: variant.productId,
      color: variant.color,
      size: variant.size,
      price: variant.price,
      stock: variant.stock,
      discountPrice: variant.discountPrice,
      product: variant.product
        ? {
            id: variant.product.id,
            name: variant.product.name,
            price: variant.product.price,
          }
        : undefined,
      isInStock: variant.stock > 0,
    });
  }

  private toListResponse(
    variant: ProductVariant,
  ): ProductVariantListResponseDto {
    return new ProductVariantListResponseDto({
      id: variant.id,
      color: variant.color,
      size: variant.size,
      price: variant.price,
      stock: variant.stock,
      discountPrice: variant.discountPrice,
      isInStock: variant.stock > 0,
    });
  }
}
