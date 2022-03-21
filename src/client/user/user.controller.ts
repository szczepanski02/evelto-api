import { IResponseHandler } from '../../helpers/responseHandler';
import { User } from '@prisma/client';
import { ResponseHandler } from './../../helpers/responseHandler';
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { userSelectSchemaAll } from './user.select-schema';
import { UserUniquePropertyEnum } from './dtos/get.unique-property.dto';

@Controller('client/user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('getWithRelations/:id')
  async getUserWithRelations(@Param('id') id: string): Promise<IResponseHandler<User>> {
    const responseObject = await this.userService.findByUniquePropertyWithRelations(
      { propertyName: UserUniquePropertyEnum.id, propertyValue: id },
      userSelectSchemaAll
    );
    return ResponseHandler<User>(HttpStatus.OK, responseObject);
  }

}
