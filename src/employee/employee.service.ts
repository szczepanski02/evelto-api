import { SelectEmployeeDto } from './dtos/select-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { pageableResponseObject } from './../shared/others/pageableResponseObject';
import { IPageable } from './../shared/interfaces/IPageable';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { PrismaClientService } from './../prisma-client/prisma-client.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EmployeeOptionalDto } from './dtos/employee-optional.dto';
import { IPageableResponse } from '../shared/interfaces/IPageableResponse';
import { PrismaErrorHandler } from '../prisma-client/PrismaErrorHandler';
import { Employee, Authority } from '@prisma/client';
import { employeeSelectSchemaWithoutPassword } from './employee.select-schema';

@Injectable()
export class EmployeeService {
  constructor(private prismaClientService: PrismaClientService) {}

  async findById(id: number, select?: SelectEmployeeDto): Promise<EmployeeOptionalDto | null> {
    const employee = await this.prismaClientService.employee.findUnique({
      where: {
        id: +id
      },
      select
    });
    if(!employee) {
      return null;
    }
    return employee;
  }

  async getEmployeeWithRelations(id: number): Promise<EmployeeOptionalDto | null> {
    const employee = await this.prismaClientService.employee.findUnique({
      where: {
        id
      },
      include: {
        ipRequests: true,
        verificatedIPs: true
      }
    });
    if(employee) return employee;
    return null;
  }

  async getEmployeeByUsername(username: string): Promise<EmployeeOptionalDto> {
    try {
      return await this.prismaClientService.employee.findUnique({
        where: { username },
        select: employeeSelectSchemaWithoutPassword
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async findByUsername(username: string): Promise<Employee | null> {
    const employee = await this.prismaClientService.employee.findUnique({
      where: {
        username
      },
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
      console.log(error);
      PrismaErrorHandler(error);
    }
  }

  async findMany(employeePageableDto: IPageable, select?: SelectEmployeeDto): Promise<IPageableResponse<EmployeeOptionalDto[]>> {
    try {
      const employees = await this.prismaClientService.employee.findMany({
        where: {
          [employeePageableDto.filterBy]: {
            contains: employeePageableDto.filterValue,
            ...(employeePageableDto.filterValue && {mode: 'insensitive'})
          }
        },
        take: +employeePageableDto.itemsPerPage,
        skip: +employeePageableDto.currentPage * +employeePageableDto.itemsPerPage,
        select
      });
      const total = await this.prismaClientService.employee.count();
      return pageableResponseObject<EmployeeOptionalDto[]>(employeePageableDto, total, employees);
    } catch (error) {
      PrismaErrorHandler(error);
    }

  }

  async deleteOne(id: number): Promise<Employee> {
    try {
      return await this.prismaClientService.employee.delete({
        where: { id }
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async updateOne(payload: UpdateEmployeeDto, id: number): Promise<any> {
    try {
      return await this.prismaClientService.employee.update({
        where: { id },
        data: {
          username: payload.username,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          isActive: payload.isActive,
          ipVerification: payload.ipVerification
        }
      })
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async changeAuthority(id: number, payload: { authority: Authority }) {
    try {
      return await this.prismaClientService.employee.update({
        where: { id },
        data: {
          authority: payload.authority
        }
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

}
