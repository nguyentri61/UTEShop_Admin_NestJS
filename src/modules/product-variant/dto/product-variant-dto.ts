export class CreateProductVariantDto {
  productId: string;
  color?: string;
  size?: string;
  price: number;
  stock: number;
  discountPrice?: number;
}

export class UpdateProductVariantDto {
  color?: string;
  size?: string;
  price?: number;
  stock?: number;
  discountPrice?: number;
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
  productId: string;
  color?: string;
  size?: string;
  price: number;
  stock: number;
  discountPrice?: number;
  product?: {
    id: string;
    name: string;
    price: number;
  };
  isInStock: boolean;

  constructor(partial: Partial<ProductVariantDetailResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ProductVariantListResponseDto {
  id: string;
  color?: string;
  size?: string;
  price: number;
  stock: number;
  discountPrice?: number;
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
