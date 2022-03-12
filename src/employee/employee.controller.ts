import { IdValidator } from './../shared/others/idValidator';
import { VerificatedIP, IPRequest } from '@prisma/client';
import { Authority } from '.prisma/client';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { IPageableResponse } from './../shared/interfaces/IPageableResponse';
import { pageablePayloadValidator } from './../shared/others/pageablePayloadValidator';
import { IPageable } from './../shared/interfaces/IPageable';
import { ResponseHandler, IResponseHandler } from './../shared/others/responseHandler';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { Body, Controller, Post, HttpException, HttpStatus, Param, Get, Query, Delete, Put, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeOptionalDto } from './dtos/employee-optional.dto';
import { employeeSelectSchemaPageable, employeeSelectSchemaWithoutPassword } from './employee.select-schema';
import { AuthoritiesGuard } from 'src/shared/guards/authorities.guard';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // @UseGuards(AuthoritiesGuard([Authority.ROOT]))
  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<IResponseHandler<string>> {
    // to change
    createEmployeeDto.createdBy = 'SERVER_ROOT';
    // 
    const responseObject = await this.employeeService.create(createEmployeeDto);
    if(!responseObject) {
      throw new HttpException(
        'Error at creating new employee, please contact with IT Support',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
    return ResponseHandler<string>(HttpStatus.CREATED, 'Employee has been created successfully');
  }

  // returning one employee by id
  @UseGuards(AuthoritiesGuard())
  @Get(':id')
  async findById(@Param('id') id: string): Promise<IResponseHandler<EmployeeOptionalDto>> {
    IdValidator(+id);
    const responseObject = await this.employeeService.findById(+id, employeeSelectSchemaWithoutPassword);
    if(!responseObject) {
      throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);
    }
    return ResponseHandler<EmployeeOptionalDto>(HttpStatus.OK, responseObject);
  }

  // returning list of employee
  @UseGuards(AuthoritiesGuard())
  @Get()
  async findMany(@Query() employeePageableDto: IPageable): Promise<IResponseHandler<IPageableResponse<EmployeeOptionalDto[]>>> {
    employeePageableDto = pageablePayloadValidator(employeePageableDto);
    const responseObjects = await this.employeeService.findMany(employeePageableDto, employeeSelectSchemaPageable);
    return ResponseHandler<IPageableResponse<EmployeeOptionalDto[]>>(HttpStatus.OK, responseObjects);
  }

  // removing employee
  @UseGuards(AuthoritiesGuard([Authority.ROOT, Authority.DATA_SUPPORT]))
  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<IResponseHandler<string>> {
    IdValidator(+id);
    await this.employeeService.deleteOne(Number(id));
    return ResponseHandler<string>(HttpStatus.OK, 'Employee has been removed');
  }

  // updating employee properties
  @UseGuards(AuthoritiesGuard([Authority.ROOT, Authority.DATA_SUPPORT]))
  @Put(':id')
  async updateOne(@Body() updateEmployeeDto: UpdateEmployeeDto, @Param('id') id: string): Promise<IResponseHandler<string>> {
    IdValidator(+id);
    await this.employeeService.updateOne(updateEmployeeDto, Number(id));
    return ResponseHandler<string>(HttpStatus.OK, 'Employee has been updated');
  }

  // getting all verificated IPs of employee
  @Get('/verificatedIPs/:id')
  async employeeVerificatedIPs(@Param('id') employeeId: string): Promise<IResponseHandler<{ id: number, address: string }[]>> {
    IdValidator(+employeeId);
    const employee = await this.employeeService.getEmployeeWithRelations(+employeeId);
    if(!employee) throw new HttpException('Cannot find employee', HttpStatus.BAD_REQUEST);
    const verificatedIPs = employee.verificatedIPs.map((obj: VerificatedIP) => {
      return { id: obj.id, address: obj.address };
    });
    return ResponseHandler<{ id: number, address: string }[]>(HttpStatus.OK, verificatedIPs);
  }

  // getting all IP requests of employee
  @Get('/IPRequests/:id')
  async employeeIPRequests(@Param('id') employeeId: string): Promise<IResponseHandler<{ id: number, address: string }[]>> {
    IdValidator(+employeeId);
    const employee = await this.employeeService.getEmployeeWithRelations(+employeeId);
    if(!employee) throw new HttpException('Cannot find employee', HttpStatus.BAD_REQUEST);
    const requests = employee.ipRequests.map((obj: IPRequest) => {
      return { id: obj.id, address: obj.address };
    });
    return ResponseHandler<{ id: number, address: string }[]>(HttpStatus.OK, requests);
  }

}
