import { Request } from 'express';

export interface IRequestUserFromGoogle extends Request {
  user: {
    email: string,
    firstName: string,
    lastName: string,
    picture?: string,
    accessToken: string
  }  
}