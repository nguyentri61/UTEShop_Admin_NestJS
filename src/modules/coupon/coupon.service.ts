import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Coupon } from "./coupon.entity";
import {
  CouponResponseDto,
  CreateCouponDto,
  UpdateCouponDto,
} from "src/modules/coupon/coupon.dto";

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon) private couponRepository: Repository<Coupon>,
  ) {}

  async create(dto: CreateCouponDto): Promise<CouponResponseDto> {
    const exist = await this.couponRepository.findOne({
      where: { code: dto.code },
    });
    if (exist) throw new BadRequestException("Coupon code already exists");

    const coupon = this.couponRepository.create(dto);
    const saved = await this.couponRepository.save(coupon);
    return this.toResponse(saved);
  }

  async findAll(): Promise<CouponResponseDto[]> {
    const coupons = await this.couponRepository.find();
    return coupons.map((coupon) => this.toResponse(coupon));
  }

  async findOne(id: string): Promise<CouponResponseDto> {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException(`Coupon with ID ${id} not found`);
    return this.toResponse(coupon);
  }

  async update(id: string, dto: UpdateCouponDto): Promise<CouponResponseDto> {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException(`Coupon with ID ${id} not found`);

    Object.assign(coupon, dto);
    const updated = await this.couponRepository.save(coupon);
    return this.toResponse(updated);
  }

  async remove(id: string): Promise<void> {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException(`Coupon with ID ${id} not found`);
    await this.couponRepository.remove(coupon);
  }

  private toResponse(coupon: Coupon): CouponResponseDto {
    return new CouponResponseDto({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      description: coupon.description,
      discount: coupon.discount,
      minOrderValue: coupon.minOrderValue,
      expiredAt: coupon.expiredAt,
    });
  }
}
