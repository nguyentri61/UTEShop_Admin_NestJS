export class CreateCategoryDto {
  name: string;
  icon?: string;
}

export class UpdateCategoryDto {
  name?: string;
  icon?: string;
}

export class CategoryResponse {
  id: string;
  name: string;
  icon?: string;
  createdAt: Date;

  constructor(partial: Partial<CategoryResponse>) {
    Object.assign(this, partial);
  }
}
