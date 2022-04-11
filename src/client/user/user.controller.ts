import { PutUserDto } from './dtos/put.user.dto';
import { PutLangDto } from './dtos/put.lang.dto';
import { IResponseHandler } from '../../helpers/responseHandler';
import { User } from '@prisma/client';
import { ResponseHandler } from './../../helpers/responseHandler';
import {
  Controller,
  Get,
  HttpStatus,
  Body,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { userSelectSchemaAll } from './user.select-schema';
import { UserUniquePropertyEnum } from './dtos/get.unique-property.dto';
import { AccountTypeGuard } from '../shared/guards/authorities.guard';
import { IAuthorizatedUser } from '../shared/interfaces/IAuthorizatedUser';
import { I18nLang, I18nService } from 'nestjs-i18n';

@Controller('client/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private i18n: I18nService,
  ) { }

  @Get('getWithRelations')
  @UseGuards(AccountTypeGuard())
  async getUserWithRelations(
    @Req() req: IAuthorizatedUser,
  ): Promise<IResponseHandler<User>> {
    const responseObject =
      await this.userService.findByUniquePropertyWithRelations(
        { propertyName: UserUniquePropertyEnum.id, propertyValue: req.user.id },
        userSelectSchemaAll,
      );
    return ResponseHandler<User>(HttpStatus.OK, responseObject);
  }

  @Put('lang')
  @UseGuards(AccountTypeGuard())
  async setLang(
    @Body() putLangDto: PutLangDto,
    @Req() req: IAuthorizatedUser,
  ): Promise<IResponseHandler<string>> {
    await this.userService.setLang(req.user.id, putLangDto.lang);
    return ResponseHandler<string>(HttpStatus.NO_CONTENT, 'Lang changed');
  }

  @Put('update')
  @UseGuards(AccountTypeGuard())
  async update(
    @Body() putUserDto: PutUserDto,
    @Req() req: IAuthorizatedUser,
    @I18nLang() lang: string,
  ): Promise<any> {
    await this.userService.userUpdate(putUserDto, req.user.id);
    return ResponseHandler<string>(
      HttpStatus.OK,
      await this.i18n.translate('user.profileUpdated', { lang }),
    );
  }
}
