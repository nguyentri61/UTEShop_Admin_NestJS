export class CreateProductVariantDto {
  productId: string;

  size: string;

  color: string;

  price: number;

  stock: number;

  sku?: string;

  imageUrl?: string;
}

export class UpdateProductVariantDto {
  size?: string;

  color?: string;

  price?: number;

  stock?: number;

  sku?: string;

  imageUrl?: string;
}

export class ProductBasicInfoDto {
  id: string;
  name: string;
  price: number;

  constructor(partial: Partial<ProductBasicInfoDto>) {
    Object.assign(this, partial);
  }
}

export class ProductVariantDetailResponseDto {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  sku?: string;
  imageUrl?: string;
  product?: ProductBasicInfoDto;
  isInStock: boolean;
  createdAt?: Date;

  constructor(partial: Partial<ProductVariantDetailResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ProductVariantListResponseDto {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  sku?: string;
  isInStock: boolean;

  constructor(partial: Partial<ProductVariantListResponseDto>) {
    Object.assign(this, partial);
  }
}

export class AvailableOptionsResponseDto {
  sizes: string[];
  colors: string[];

  constructor(partial: Partial<AvailableOptionsResponseDto>) {
    Object.assign(this, partial);
  }
}
