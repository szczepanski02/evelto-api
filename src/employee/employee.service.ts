import { Authority } from './../shared/enums/authority.enum';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { PrismaClientService } from './../prisma-client/prisma-client.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Employee } from '.prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private prismaClientService: PrismaClientService) {}

  async findById(id: number): Promise<Employee> {
    const employee = await this.prismaClientService.employee.findUnique({
      where: {
        id,
      }
    });
    if(!employee) {
      return null;
    }
    return employee;
  }

  async create(payload: CreateEmployeeDto): Promise<Employee> {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    try {
      const newEmployee = await this.prismaClientService.employee.create({
        data: {
          username: payload.username,
          email: payload.email,
          password: hashedPassword,
          firstName: payload.firstName,
          lastName: payload.lastName,
          createdBy: payload.createdBy
        }
      });
      return newEmployee;
    } catch (error) {
      throw new HttpException(
        'Failed at creating new employee, please contact with IT Support',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

}
