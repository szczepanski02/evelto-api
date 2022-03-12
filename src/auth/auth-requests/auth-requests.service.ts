import { AuthIpsService } from './../auth-ips/auth-ips.service';
import { PrismaErrorHandler } from 'src/prisma-client/PrismaErrorHandler';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthRequestsService {
  constructor(
    private readonly prismaClientService: PrismaClientService,
    private readonly authIPsService: AuthIpsService
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

  async accept(requestId: number) {
    const request = await this.prismaClientService.iPRequest.findUnique({
      where: { id: requestId }
    });
    if(request) {
      await this.authIPsService.addVerificatedIPs(request);
      try {
        return await this.prismaClientService.iPRequest.delete({
          where: {
            id: requestId
          }
        });
      } catch (error) {
        PrismaErrorHandler(error);
      }
    }
    throw new HttpException(
      'Cannot find request, please raport it to IT Support',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

}
