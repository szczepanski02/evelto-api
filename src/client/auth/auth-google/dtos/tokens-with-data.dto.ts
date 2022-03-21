import { ClientIsActive, AccountType } from '@prisma/client';
export class TokensWithDataDto {
  tokens: {
    access_token: string;
    refresh_token: string;
  }
  isActive: ClientIsActive;
  accountType: AccountType;
  id: string;
}