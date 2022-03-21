import { AccountType } from '@prisma/client';
export class UserTokensDto {
  access_token: string;
  refresh_token: string;
  accountType?: AccountType;
}