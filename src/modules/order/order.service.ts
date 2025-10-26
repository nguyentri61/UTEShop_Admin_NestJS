import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./order.entity";
import { UpdateOrderStatusDto, OrderResponseDto } from "./dto/order-dto";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      relations: ["items", "coupons", "user"],
    });
    return orders.map((order) => this.toResponse(order));
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ["items", "coupons", "user"],
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return this.toResponse(order);
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    order.status = dto.status;
    await this.orderRepository.save(order);
    return this.toResponse(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    await this.orderRepository.remove(order);
  }

  private toResponse(order: Order): OrderResponseDto {
    return new OrderResponseDto({
      id: order.id,
      address: order.address,
      phone: order.phone,
      createdAt: order.createdAt,
      total: order.total,
      status: order.status,
      userId: order.userId,
      items: order.items?.map((item) => ({
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      })),
      coupons: order.coupons?.map((coupon) => ({
        id: coupon.id,
        code: coupon.code,
        discount: coupon.discount,
      })),
    });
  }
}
