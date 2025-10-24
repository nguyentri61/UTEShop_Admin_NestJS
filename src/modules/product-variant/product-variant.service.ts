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

    // Cast where object to any to avoid TS strict checking mismatch
    const exist = await this.repo.findOne({
      where: {
        productId: dto.productId,
        size: dto.size,
        color: dto.color,
      } as any,
    });
    if (exist)
      throw new BadRequestException("Variant with same attributes exists");

    const v = this.repo.create(dto as any);
    // normalize save result (can be entity or array)
    const savedResult = await this.repo.save(v);
    const saved = Array.isArray(savedResult)
      ? (savedResult[0] as ProductVariant)
      : (savedResult as ProductVariant);

    if (!saved || !saved.id) {
      throw new BadRequestException("Variant not saved correctly");
    }

    const full = await this.repo.findOne({
      where: { id: saved.id },
      relations: ["product"],
    });

    if (!full) {
      throw new NotFoundException(
        `Variant with ID ${saved.id} not found after create`,
      );
    }

    return this.toResponse(full as ProductVariant);
  }

  async findAll() {
    const items = await this.repo.find({
      relations: ["product"],
    });
    return items.map((i) => this.toListResponse(i));
  }

  async findByProduct(productId: string) {
    const items = await this.repo.find({
      where: { productId } as any,
      relations: ["product"],
      order: { size: "ASC", color: "ASC" } as any,
    });
    return items.map((i) => this.toListResponse(i));
  }

  async findOne(id: string) {
    const v = await this.repo.findOne({
      where: { id } as any,
      relations: ["product"],
    });
    if (!v) throw new NotFoundException(`Variant ${id} not found`);
    return this.toResponse(v as any);
  }

  async findByAttributes(productId: string, size: string, color: string) {
    const v = await this.repo.findOne({
      where: { productId, size, color } as any,
      relations: ["product"],
    });
    if (!v)
      throw new NotFoundException(
        "Variant not found with specified attributes",
      );
    return this.toResponse(v as any);
  }

  async update(id: string, dto: UpdateProductVariantDto) {
    const v = await this.repo.findOne({ where: { id } as any });
    if (!v) throw new NotFoundException(`Variant ${id} not found`);

    const variant = v as any;

    if (dto.size || dto.color) {
      const size = dto.size ?? variant.size;
      const color = dto.color ?? variant.color;
      const dup = await this.repo.findOne({
        where: { productId: variant.productId, size, color } as any,
      });
      if (dup && (dup as any).id !== id)
        throw new BadRequestException("Duplicate variant");
    }
    Object.assign(variant, dto);
    await this.repo.save(variant);
    return this.findOne(id);
  }

  async remove(id: string) {
    const v = await this.repo.findOne({ where: { id } as any });
    if (!v) throw new NotFoundException(`Variant ${id} not found`);
    await this.repo.remove(v as any);
  }

  async updateStock(id: string, quantity: number) {
    const v = await this.repo.findOne({ where: { id } as any });
    if (!v) throw new NotFoundException(`Variant ${id} not found`);

    const variant = v as any;
    if ((variant.stock ?? 0) + quantity < 0)
      throw new BadRequestException("Insufficient stock");
    variant.stock = Number(variant.stock ?? 0) + Number(quantity);
    await this.repo.save(variant);
    return this.findOne(id);
  }

  async checkStock(id: string, quantity: number) {
    const v = await this.repo.findOne({ where: { id } as any });
    if (!v) throw new NotFoundException(`Variant ${id} not found`);
    const variant = v as any;
    return {
      available: (variant.stock ?? 0) >= quantity,
      stock: Number(variant.stock ?? 0),
    };
  }

  async getAvailableSizes(productId: string) {
    const rows = await this.repo.find({
      where: { productId },
      select: ["size"] as any,
    });
    // rows may be typed as ProductVariant[] by TypeORM typings; assert any to access selected fields safely
    return [...new Set((rows as any[]).map((r) => (r as any).size))].sort();
  }

  async getAvailableColors(productId: string, size?: string) {
    const where: any = { productId };
    if (size) where.size = size;
    const rows = await this.repo.find({ where, select: ["color"] as any });
    return [...new Set((rows as any[]).map((r) => (r as any).color))].sort();
  }

  async getAvailableOptions(productId: string) {
    const [sizes, colors] = await Promise.all([
      this.getAvailableSizes(productId),
      this.getAvailableColors(productId),
    ]);
    return { sizes, colors };
  }

  // thêm helper chuyển đổi giống CategoryService.toResponse
  private toResponse(variant: any): ProductVariantDetailResponseDto {
    return new ProductVariantDetailResponseDto({
      id: variant.id,
      size: variant.size,
      color: variant.color,
      price: Number(variant.price),
      stock: Number(variant.stock ?? 0),
      sku: variant.sku,
      imageUrl: variant.imageUrl,
      product: variant.product
        ? {
            id: variant.product.id,
            name: variant.product.name,
            price: Number(variant.product.price),
          }
        : undefined,
      isInStock: Number(variant.stock ?? 0) > 0,
    });
  }

  private toListResponse(variant: any): ProductVariantListResponseDto {
    return new ProductVariantListResponseDto({
      id: variant.id,
      size: variant.size,
      color: variant.color,
      price: Number(variant.price),
      stock: Number(variant.stock ?? 0),
      sku: variant.sku,
      isInStock: Number(variant.stock ?? 0) > 0,
    });
  }
}
