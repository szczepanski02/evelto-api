import { PrismaErrorHandler } from 'src/prisma-client/PrismaErrorHandler';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRequestsService {
  constructor(
    private readonly prismaClientService: PrismaClientService
  ) {}

  async create(address: string, id: number) {
    try {
      return await this.prismaClientService.iPRequest.create({
        data: {
          address,
          employeeId: id
        }
      })
    } catch (error) {
      console.log(error);
      PrismaErrorHandler(error);
    }
  }

}
