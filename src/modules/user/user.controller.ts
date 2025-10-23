import {
  Controller,
  Get,
  Put,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { BlockUserDto } from "./dto/block-user.dto";
import { ApiResponse } from "src/common/response/api-response";
import { UpdateUserRequest } from "./dto/update-user-request";
import { UserResponse } from "./dto/user-response";

@Controller("users")
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async getAll(): Promise<ApiResponse<UserResponse[]>> {
    const users = await this.service.findAll();
    return ApiResponse.success(users);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() request: UpdateUserRequest,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.service.update(id, request);
    return ApiResponse.success(user);
  }

  @Patch(":id/block")
  @HttpCode(HttpStatus.OK)
  async block(
    @Param("id") id: string,
    @Body() dto: BlockUserDto,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.service.setBlocked(id, dto.blocked);
    return ApiResponse.success(user);
  }
}
