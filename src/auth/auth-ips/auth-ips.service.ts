import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPRequest, VerificatedIP } from '@prisma/client';
import { EmployeeService } from '../../employee/employee.service';
import { PrismaClientService } from '../../prisma-client/prisma-client.service';
import { PrismaErrorHandler } from '../../prisma-client/PrismaErrorHandler';
@Injectable()
export class AuthIpsService {

  constructor(
    private readonly prismaClientService: PrismaClientService,
    private readonly employeeService: EmployeeService
  ) {}

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

  async getIPsOfEmployee(employeeId: number): Promise<{ id: number, address: string }[]> {
    const employee = await this.employeeService.getEmployeeWithRelations(employeeId);
    if(!employee) throw new HttpException('Cannot find employee', HttpStatus.BAD_REQUEST);
    const verificatedIPs = employee.verificatedIPs.map((obj: VerificatedIP) => {
      return { id: obj.id, address: obj.address };
    });
    return verificatedIPs;
  }

}
