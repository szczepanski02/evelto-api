import { ClientIsActive } from '@prisma/client';
import { AccountType, Lang } from './../../../../node_modules/.prisma/client/index.d';
export interface IClientJwtPayload {
  id: string;
  username: string;
  accountType: AccountType;
  lang: Lang;
  firstName: string;
  lastName: string;
  isActive: ClientIsActive;
}