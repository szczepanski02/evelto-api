import { PrismaErrorHandler } from './../../prisma-client/PrismaErrorHandler';
import { Lang, User } from './../../../node_modules/.prisma/client/index.d';
import { GetUniquePropertyDto } from './dtos/get.unique-property.dto';
import { PrismaClientService } from '../../prisma-client/prisma-client.service';
import { Injectable } from '@nestjs/common';
import { IUserSelect } from './user.select-schema';

@Injectable()
export class UserService {

  constructor(
    private readonly prismaClientService: PrismaClientService
  ) {}

  async findByUniqueProperty(getUniquePropertyDto: GetUniquePropertyDto): Promise<User> {
    try {
      return await this.prismaClientService.user.findUnique({
        where: { [getUniquePropertyDto.propertyName]: getUniquePropertyDto.propertyValue }
      });
    } catch (error) {
      return null;
    }
  }

  async findByUniquePropertyWithRelations(
    getUniquePropertyDto: GetUniquePropertyDto,
    select: IUserSelect
  ): Promise<User> {
    try {
      return await this.prismaClientService.user.findUnique({
        where: { [getUniquePropertyDto.propertyName]: getUniquePropertyDto.propertyValue },
        select
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  // LANG
  async setLang(id: string, lang: Lang): Promise<User> {
    try {
      return await this.prismaClientService.user.update({
        where: { id },
        data: { lang }
      })
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

}
