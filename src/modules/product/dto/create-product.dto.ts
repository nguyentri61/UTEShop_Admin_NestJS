export class CreateProductDto {
  name: string;
  price: number;
  description?: string;
  stock?: number;
  categoryId?: string;
  // add other product fields
}
