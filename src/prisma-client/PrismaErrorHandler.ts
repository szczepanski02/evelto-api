import { HttpException, HttpStatus } from "@nestjs/common";

export const PrismaErrorHandler = (error: IPrismaError) => {
  if(error.code === 'P2002') {
    throw new HttpException(
      { key: 'prisma.notUniqueProperty', args: { propertyName: error.meta.target }},
      HttpStatus.BAD_REQUEST
    )
  }

  // P1016 - Your raw query had an incorrect number of parameters. Expected: {expected}, actual: {actual}
  // P2007 - Data validation error,
  // P2010 - Raw query failed. Code: {code}. Message: {message}
  // P2012 - Missing a required value at {path}
  // P2016 - Query interpretation error. {details}
  if(
    error.code === 'P1016'
    || error.code === 'P2007'
    || error.code === 'P2010'
    || error.code === 'P2012'
    || error.code === 'P2016'
  ) {
    throw new HttpException(
      { key: 'prisma.invalidRequest' },
      HttpStatus.BAD_REQUEST
    )
  }

  if(error.code === 'P2025') {
    throw new HttpException({ key: 'prisma.notFound' }, HttpStatus.BAD_REQUEST);
  }

  // else
  throw new HttpException(
    { key: 'prisma.someError' },
    HttpStatus.INTERNAL_SERVER_ERROR
  )
}


interface IPrismaError {
  code: string;
  meta: { target: string[] }
}