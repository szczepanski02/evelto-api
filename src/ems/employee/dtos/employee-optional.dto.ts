import { IPRequest, VerificatedIP } from '@prisma/client';
import { Authority } from ".prisma/client";

export class EmployeeOptionalDto {
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImg?: string;
  isActive?: boolean;
  ipVerification?: boolean;
  createdAt?: Date;
  createdBy?: string;
  authority?: Authority;
  ipRequests?: IPRequest[];
  verificatedIPs?: VerificatedIP[];
}