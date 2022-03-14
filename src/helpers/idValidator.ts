import { HttpException, HttpStatus } from '@nestjs/common';
export const IdValidator = (id: number | null) => {
  if(isNaN(id)) {
    throw new HttpException('Invalid request (I102), please contact with ID Support.', HttpStatus.BAD_REQUEST)
  }
}