import { User } from './../../../node_modules/.prisma/client/index.d';
import { GetUniquePropertyDto } from './dtos/get.unique-property.dto';
import { PrismaClientService } from '../../prisma-client/prisma-client.service';
import { Injectable } from '@nestjs/common';

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

}
