import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import {
  CreateProductDto,
  UpdateProductDto,
  QueryProductDto,
  ProductResponseDto,
  ProductListResponseDto,
  PaginatedProductResponseDto,
} from "./dto/product-dto";
import { ProductImage } from "src/modules/product-image/product-image.entity";
import { ProductVariant } from "src/modules/product-variant/product-variant.entity";
import { Review } from "src/modules/review/review.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    // create entity (avoid unsafe any)
    const p = this.productRepository.create(dto as unknown as Product);

    // save can return entity or array of entities - normalize to single Product
    const savedResult = await this.productRepository.save(p);
    const saved = Array.isArray(savedResult)
      ? (savedResult[0] as Product)
      : savedResult;

    if (!saved || !saved.id) {
      throw new NotFoundException(`Product not saved correctly`);
    }

    const full = await this.productRepository.findOne({
      where: { id: saved.id },
      relations: [
        "category",
        "productImage",
        "variants",
        "reviews",
        "reviews.user",
      ],
    });

    if (!full) {
      throw new NotFoundException(
        `Product with ID ${saved.id} not found after create`,
      );
    }

    return this.toResponse(full);
  }

  async findAll(query?: QueryProductDto): Promise<PaginatedProductResponseDto> {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "DESC",
    } = query || {};

    const qb = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.productImage", "productImage")
      .leftJoinAndSelect("product.variants", "variants")
      .leftJoinAndSelect("product.reviews", "reviews");

    if (search) {
      qb.andWhere("(product.name LIKE :s OR product.description LIKE :s)", {
        s: `%${search}%`,
      });
    }
    if (categoryId)
      qb.andWhere("product.categoryId = :cat", { cat: categoryId });
    if (minPrice !== undefined && maxPrice !== undefined) {
      qb.andWhere("product.price BETWEEN :min AND :max", {
        min: minPrice,
        max: maxPrice,
      });
    } else if (minPrice !== undefined) {
      qb.andWhere("product.price >= :min", { min: minPrice });
    } else if (maxPrice !== undefined) {
      qb.andWhere("product.price <= :max", { max: maxPrice });
    }

    qb.orderBy(`product.${sortBy}`, order === "ASC" ? "ASC" : "DESC");
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    const meta = { total, page, limit, totalPages: Math.ceil(total / limit) };
    return {
      data: items.map((p) => this.toListResponse(p)),
      meta,
    };
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: [
        "category",
        "productImage",
        "variants",
        "reviews",
        "reviews.user",
      ],
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return this.toResponse(product);
  }

  async findByCategory(categoryId: string, query?: QueryProductDto) {
    return this.findAll({ ...(query || {}), categoryId });
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);

    if (dto.categoryId && dto.categoryId !== product.categoryId) {
      const cat = await this.productRepository.manager.findOne("category", {
        where: { id: dto.categoryId },
      });
      if (!cat) throw new BadRequestException("Category not found");
    }

    Object.assign(product, dto);
    await this.productRepository.save(product);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    await this.productRepository.remove(product);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.productRepository.increment({ id }, "viewCount", 1);
  }

  async updateStock(id: string, quantity: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    if (product.stock + quantity < 0)
      throw new BadRequestException("Insufficient stock");
    product.stock += quantity;
    await this.productRepository.save(product);
    return this.findOne(id);
  }

  async checkStock(id: string, quantity: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return { available: product.stock >= quantity, stock: product.stock };
  }

  // changed: use internal toResponse instead of transformService
  async getTopViewed(limit = 10) {
    const products = await this.productRepository.find({
      relations: ["category", "productImage", "reviews"],
      order: { viewCount: "DESC" },
      take: limit,
    });
    return products.map((p) => this.toResponse(p));
  }

  // changed: use internal toResponse instead of transformService
  async getNewestProducts(limit = 10) {
    const products = await this.productRepository.find({
      relations: ["category", "productImage", "reviews"],
      order: { createdAt: "DESC" },
      take: limit,
    });
    return products.map((p) => this.toResponse(p));
  }

  // changed: use internal toResponse instead of transformService
  async getDiscountedProducts() {
    const products = await this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.productImage", "productImage")
      .leftJoinAndSelect("product.reviews", "reviews")
      .where("product.discountPrice IS NOT NULL")
      .andWhere("product.discountPrice < product.price")
      .orderBy(
        "(product.price - product.discountPrice) / product.price",
        "DESC",
      )
      .getMany();

    return products.map((p) => this.toResponse(p));
  }

  // helper chuyển đổi
  private toResponse(product: Product): ProductResponseDto {
    const dto = new ProductResponseDto();

    // assert any[] to avoid strict entity typings from hiding relation properties
    const images = ((product.productImage ?? []) as any[]).map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      isPrimary: Boolean(img.isPrimary),
    }));

    const variants = ((product.variants ?? []) as any[]).map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      price: Number(v.price),
      stock: Number(v.stock),
      sku: v.sku,
      imageUrl: v.imageUrl,
    }));

    const reviews = product.reviews ?? [];
    const reviewSummary =
      reviews.length > 0
        ? {
            averageRating:
              Math.round(
                (reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
                  reviews.length) *
                  10,
              ) / 10,
            totalReviews: reviews.length,
          }
        : undefined;

    Object.assign(dto, {
      id: product.id,
      name: product.name,
      description: product.description ?? undefined,
      price: Number(product.price),
      discountPrice:
        product.discountPrice !== undefined
          ? Number(product.discountPrice)
          : undefined,
      discountPercentage:
        product.discountPrice && product.price > product.discountPrice
          ? Math.round(
              ((Number(product.price) - Number(product.discountPrice)) /
                Number(product.price)) *
                100,
            )
          : undefined,
      stock: Number(product.stock),
      viewCount: Number(product.viewCount ?? 0),
      createdAt: product.createdAt,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            description: (product.category as any).description ?? undefined,
          }
        : undefined,
      images,
      variants,
      reviewSummary,
      isInStock: Number(product.stock) > 0,
      hasDiscount:
        product.discountPrice !== undefined &&
        Number(product.price) > Number(product.discountPrice),
    });

    return dto;
  }

  private toListResponse(product: Product): ProductListResponseDto {
    const dto = new ProductListResponseDto();

    const productImages = (product.productImage ?? []) as any[];
    const primaryImage = productImages.length
      ? (((productImages.find((i) => i.isPrimary) ?? productImages[0]) as any)
          .imageUrl as string)
      : undefined;

    const reviews = (product.reviews ?? []) as Review[];
    const avgRating =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) /
              reviews.length) *
              10,
          ) / 10
        : undefined;

    Object.assign(dto, {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      discountPrice:
        product.discountPrice !== undefined
          ? Number(product.discountPrice)
          : undefined,
      discountPercentage:
        product.discountPrice && product.price > product.discountPrice
          ? Math.round(
              ((Number(product.price) - Number(product.discountPrice)) /
                Number(product.price)) *
                100,
            )
          : undefined,
      stock: Number(product.stock),
      viewCount: Number(product.viewCount ?? 0),
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            description: (product.category as any).description ?? undefined,
          }
        : undefined,
      primaryImage,
      averageRating: avgRating,
      totalReviews: reviews.length || undefined,
      isInStock: Number(product.stock) > 0,
      hasDiscount:
        product.discountPrice !== undefined &&
        Number(product.price) > Number(product.discountPrice),
    });

    return dto;
  }
}
