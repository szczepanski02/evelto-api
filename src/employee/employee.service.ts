import { SelectEmployeeDto } from './dtos/select-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { pageableResponseObject } from './../shared/others/pageableResponseObject';
import { IPageable } from './../shared/interfaces/IPageable';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { PrismaClientService } from './../prisma-client/prisma-client.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Employee } from '.prisma/client';
import { EmployeeOptionalDto } from './dtos/employee-optional.dto';
import { IPageableResponse } from 'src/shared/interfaces/IPageableResponse';

@Injectable()
export class EmployeeService {
  constructor(private prismaClientService: PrismaClientService) {}

  async findById(id: number, select?: SelectEmployeeDto): Promise<EmployeeOptionalDto | null> {
    const employee = await this.prismaClientService.employee.findUnique({
      where: {
        id,
      },
      select
    });
    if(!employee) {
      return null;
    }
    return employee;
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
      if(error.code === 'P2002') {
        throw new HttpException(
          'Typed username or email already exists',
          HttpStatus.BAD_REQUEST
        )
      }
      throw new HttpException(
        'Failed at creating new employee, please contact with IT Support',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findMany(employeePageableDto: IPageable, select?: SelectEmployeeDto): Promise<IPageableResponse<EmployeeOptionalDto[]>> {
    try {
      const employees = await this.prismaClientService.employee.findMany({
        where: {
          [employeePageableDto.filterBy]: {
            contains: employeePageableDto.filterValue
          }
        },
        take: +employeePageableDto.itemsPerPage,
        skip: +employeePageableDto.currentPage * +employeePageableDto.itemsPerPage,
        select
      });
      const total = await this.prismaClientService.employee.count();
      return pageableResponseObject<EmployeeOptionalDto[]>(employeePageableDto, total, employees);
    } catch (error) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

  }

  async deleteOne(id: number): Promise<Employee> {
    try {
      return await this.prismaClientService.employee.delete({
        where: { id }
      });
    } catch (error) {
      if(error.code === 'P2025') {
        throw new HttpException('Employee not found, please raport it to IT Support', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Cannot delete employee, please raport it to IT Support', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateOne(payload: UpdateEmployeeDto, id: number): Promise<any> {
    try {
      return await this.prismaClientService.employee.update({
        where: { id },
        data: {
          username: payload.username,
          firstName: payload.firstName,
          email: payload.email,
          isActive: payload.isActive,
          ipVerification: payload.ipVerification
        }
      })
    } catch (error) {
      console.log(error.code);
      if(error.code === 'P2025') {
        throw new HttpException('Employee not found, please raport it to IT Support', HttpStatus.BAD_REQUEST);
      }
      if(error.code === 'P2002') {
        throw new HttpException(
          'Typed username or email already exists',
          HttpStatus.BAD_REQUEST
        )
      }
      throw new HttpException('Cannot update employee, please raport it to IT Support', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
