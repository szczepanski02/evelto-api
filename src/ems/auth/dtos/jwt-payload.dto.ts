import { Authority } from '.prisma/client';

export class JwtPayloadDto {
  id: number;
  username: string;
  authority: Authority;
  firstName: string;
  lastName: string;
}