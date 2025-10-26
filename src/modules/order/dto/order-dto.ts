import { OrderStatus } from "../order.entity";

export class UpdateOrderStatusDto {
  status: OrderStatus;
}

export class OrderItemResponseDto {
  id: string;
  variantId: string;
  quantity: number;
  price: number;
}

export class OrderResponseDto {
  id: string;
  address: string;
  phone: string;
  createdAt: Date;
  total: number;
  status: OrderStatus;
  userId: string;
  items: OrderItemResponseDto[];
  coupons?: { id: string; code: string; discount: number }[];

  constructor(partial: Partial<OrderResponseDto>) {
    Object.assign(this, partial);
  }
}
