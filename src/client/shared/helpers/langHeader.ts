import { Request } from "express"

export const getLangFromHeader = (req: Request) => {
  return req.header('x-custom-lang');
}