import { HttpException, HttpStatus } from '@nestjs/common';
export const IdValidator = (id: number | null) => {
  if(isNaN(id)) {
    throw new HttpException({ key: 'prisma.invalidId' }, HttpStatus.BAD_REQUEST)
  }
}