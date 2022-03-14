import { Lang, AccountType } from './../../../../node_modules/.prisma/client/index.d';
import { Request } from 'express';
export interface IAuthorizatedUser extends Request {
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    lang: Lang;
    accountType: AccountType;
  }
}