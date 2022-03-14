import { Authority } from "@prisma/client";
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