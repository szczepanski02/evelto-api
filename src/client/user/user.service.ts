import { PutUserDto } from './dtos/put.user.dto';
import { PrismaErrorHandler } from './../../prisma-client/PrismaErrorHandler';
import { Lang, User } from './../../../node_modules/.prisma/client/index.d';
import { GetUniquePropertyDto } from './dtos/get.unique-property.dto';
import { PrismaClientService } from '../../prisma-client/prisma-client.service';
import { Injectable } from '@nestjs/common';
import { IUserSelect } from './user.select-schema';

@Injectable()
export class UserService {
  constructor(private readonly prismaClientService: PrismaClientService) { }

  async findByUniqueProperty(
    getUniquePropertyDto: GetUniquePropertyDto,
  ): Promise<User | null> {
    try {
      return await this.prismaClientService.user.findUnique({
        where: {
          [getUniquePropertyDto.propertyName]:
            getUniquePropertyDto.propertyValue,
        },
      });
    } catch (error) {
      return null;
    }
  }

  async findByUniquePropertyWithRelations(
    getUniquePropertyDto: GetUniquePropertyDto,
    select: IUserSelect,
  ): Promise<User> {
    try {
      return await this.prismaClientService.user.findUnique({
        where: {
          [getUniquePropertyDto.propertyName]:
            getUniquePropertyDto.propertyValue,
        },
        select,
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
        data: { lang },
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async userUpdate(putUserDto: PutUserDto, id: string): Promise<User> {
    try {
      return await this.prismaClientService.user.update({
        where: { id },
        data: {
          username: putUserDto.username,
          email: putUserDto.email,
          userDetails: {
            update: {
              birthDate: putUserDto.birthDate,
              gender: putUserDto.gender,
              phoneNumber: putUserDto.phoneNumber,
              profileImg: putUserDto.profileImg,
              userAddress: {
                update: {
                  country: putUserDto.country,
                  city: putUserDto.city,
                  zipCode: putUserDto.zipCode,
                  address1: putUserDto.address1,
                  address2: putUserDto.address2,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }
}
