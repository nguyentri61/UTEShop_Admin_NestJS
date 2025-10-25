import { UserRole } from "src/modules/user/user.entity";

export class UserResponse {
  id: string;
  email: string;
  fullName?: string;
  gender?: string;
  phone?: string;
  address?: string;
  role: UserRole;
  blocked: boolean;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
