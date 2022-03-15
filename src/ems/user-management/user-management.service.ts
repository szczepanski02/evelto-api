import { PrismaClientService } from './../../prisma-client/prisma-client.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserManagementService {

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getAmonutOfUserAccounts(): Promise<number> {
    try {
      return await this.prismaClientService.user.count();
    } catch (error) {
      throw new HttpException('', HttpStatus.NO_CONTENT);
    }
  }

}
