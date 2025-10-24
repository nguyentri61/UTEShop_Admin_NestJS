export class CreateProductDto {
  name: string;

  description?: string;

  price: number;

  discountPrice?: number;

  stock: number;

  categoryId: string;
}

export class UpdateProductDto {
  name?: string;

  description?: string;

  price?: number;

  discountPrice?: number;

  stock?: number;

  categoryId?: string;
}

export class QueryProductDto {
  search?: string;

  categoryId?: string;

  minPrice?: number;

  maxPrice?: number;
  page?: number = 1;

  limit?: number = 10;

  sortBy?: string = "createdAt";

  order?: "ASC" | "DESC" = "DESC";
}

export class CategoryResponseDto {
  id: string;

  name: string;

  description?: string;
}

export class ProductImageResponseDto {
  id: string;

  imageUrl: string;

  isPrimary: boolean;
}

export class ProductVariantResponseDto {
  id: string;

  size: string;

  color: string;

  price: number;

  stock: number;

  sku?: string;

  imageUrl?: string;
}

export class ReviewSummaryDto {
  averageRating: number;

  totalReviews: number;
}

export class ProductResponseDto {
  id: string;

  name: string;

  description?: string;

  price: number;

  discountPrice?: number;

  discountPercentage?: number;

  stock: number;

  viewCount: number;

  createdAt: Date;

  category: CategoryResponseDto;

  images: ProductImageResponseDto[];

  variants: ProductVariantResponseDto[];

  reviewSummary?: ReviewSummaryDto;

  isInStock: boolean;

  hasDiscount: boolean;
}

export class ProductListResponseDto {
  id: string;

  name: string;

  price: number;

  discountPrice?: number;

  discountPercentage?: number;

  stock: number;

  viewCount: number;

  category: CategoryResponseDto;

  primaryImage?: string;

  averageRating?: number;

  totalReviews?: number;

  isInStock: boolean;

  hasDiscount: boolean;
}

export class PaginatedProductResponseDto {
  data: ProductListResponseDto[];

  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
