import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { User, UserRole } from "src/modules/user/user.entity";
import { UpdateUserRequest } from "./dto/update-user-request";
import { UserResponse } from "./dto/user-response";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.repo.find({
      where: { role: Not(UserRole.ADMIN) },
    });
    return users.map((u) => this.toResponse(u));
  }

  async update(id: string, request: UpdateUserRequest): Promise<UserResponse> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    Object.assign(user, request);
    const saved = await this.repo.save(user);
    return this.toResponse(saved);
  }

  async setBlocked(id: string, blocked: boolean): Promise<UserResponse> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    user.blocked = blocked;
    const saved = await this.repo.save(user);
    return this.toResponse(saved);
  }

  private toResponse(user: User): UserResponse {
    return new UserResponse({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      gender: user.gender,
      phone: user.phone,
      address: user.address,
      role: user.role,
      blocked: user.blocked,
    });
  }
}
