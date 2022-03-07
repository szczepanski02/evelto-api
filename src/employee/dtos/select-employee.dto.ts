import { Authority } from "@prisma/client";

export class SelectEmployeeDto {
  id?: boolean;
  username?: boolean;
  password?: boolean;
  firstName?: boolean;
  lastName?: boolean;
  email?: boolean;
  profileImg?: boolean;
  isActive?: boolean;
  ipVerification?: boolean;
  createdAt?: boolean;
  createdBy?: boolean;
  authority?: boolean;
}