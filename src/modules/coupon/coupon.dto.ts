import { CouponType } from "src/modules/coupon/coupon.entity";

export class CreateCouponDto {
  code: string;
  type: CouponType;
  description: string;
  discount: number;
  minOrderValue: number;
  expiredAt: Date;
}

export class UpdateCouponDto {
  code?: string;
  type?: CouponType;
  description?: string;
  discount?: number;
  minOrderValue?: number;
  expiredAt?: Date;
}

export class CouponResponseDto {
  id: string;
  code: string;
  type: CouponType;
  description: string;
  discount: number;
  minOrderValue: number;
  expiredAt: Date;

  constructor(partial: Partial<CouponResponseDto>) {
    Object.assign(this, partial);
  }
}
