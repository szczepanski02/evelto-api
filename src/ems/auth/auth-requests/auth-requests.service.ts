import { EmployeeService } from './../../employee/employee.service';
import { IPRequest } from '@prisma/client';
import { AuthIpsService } from '../auth-ips/auth-ips.service';
import { PrismaErrorHandler } from '../../../prisma-client/PrismaErrorHandler';
import { PrismaClientService } from '../../../prisma-client/prisma-client.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GetAllRequestsDto } from './dtos/get.all-requests.dto';

@Injectable()
export class AuthRequestsService {
  constructor(
    private readonly prismaClientService: PrismaClientService,
    private readonly authIPsService: AuthIpsService,
    private readonly employeeService: EmployeeService
  ) {}

  async create(address: string, id: number): Promise<IPRequest> {
    try {
      return await this.prismaClientService.iPRequest.create({
        data: {
          address,
          employeeId: id
        }
      })
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async getAllIPRequestsOfEmployee(employeeId: number): Promise<{ id: number, address: string }[]> {
    const employee = await this.employeeService.getEmployeeWithRelations(+employeeId);
    if(!employee) throw new HttpException('Cannot find employee', HttpStatus.BAD_REQUEST);
    const requests = employee.ipRequests.map((obj: IPRequest) => {
      return { id: obj.id, address: obj.address };
    });
    return requests;
  }

  async accept(requestId: number): Promise<IPRequest> {
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

  async getAll(): Promise<GetAllRequestsDto[]> {
    try {
      return await this.prismaClientService.iPRequest.findMany({
        select: {
          address: true,
          id: true,
          createdAt: true,
          createdBy: {
            select: {
              username: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async deleteRequest(id: number): Promise<IPRequest> {
    try {
      return await this.prismaClientService.iPRequest.delete({
        where: { id }
      })
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }
  

}
