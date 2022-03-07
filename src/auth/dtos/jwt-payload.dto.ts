import { Authority } from './../../../node_modules/.prisma/client/index.d';

export class JwtPayloadDto {
  id: number;
  username: string;
  authority: Authority;
  firstName: string;
  lastName: string;
}