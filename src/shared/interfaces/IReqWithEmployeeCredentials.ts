import { Authority } from './../../../node_modules/.prisma/client/index.d';
import { Request } from "express";

export interface IReqWithEmployeeCredentials extends Request {
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    authority: Authority;
  }
}