import { Injectable } from '@nestjs/common';
import { IPRequest, VerificatedIP } from '@prisma/client';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { PrismaErrorHandler } from 'src/prisma-client/PrismaErrorHandler';

@Injectable()
export class AuthIpsService {

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async addVerificatedIPs(ipRequest: IPRequest): Promise<VerificatedIP> {
    try {
      return await this.prismaClientService.verificatedIP.create({
        data: {
          address: ipRequest.address,
          employeeId: ipRequest.employeeId
        }
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async deleteOne(verificatedId: number): Promise<VerificatedIP> {
    try {
      return await this.prismaClientService.verificatedIP.delete({
        where: { id: verificatedId }
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }


}
