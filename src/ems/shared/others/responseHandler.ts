import { HttpStatus } from '@nestjs/common';
export const ResponseHandler = <T>(code: HttpStatus, body: T) => {
  return { status: code, body }
}

export interface IResponseHandler<T> {
  status: HttpStatus,
  body: T
}