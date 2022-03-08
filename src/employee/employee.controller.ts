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

  @UseGuards(AuthoritiesGuard())
  @Get(':id')
  async findById(@Param('id') id: string): Promise<IResponseHandler<EmployeeOptionalDto>> {
    const responseObject = await this.employeeService.findById(+id, employeeSelectSchemaWithoutPassword);
    if(!responseObject) {
      throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);
    }
    return ResponseHandler<EmployeeOptionalDto>(HttpStatus.OK, responseObject);
  }

  @UseGuards(AuthoritiesGuard())
  @Get()
  async findMany(@Query() employeePageableDto: IPageable): Promise<IResponseHandler<IPageableResponse<EmployeeOptionalDto[]>>> {
    employeePageableDto = pageablePayloadValidator(employeePageableDto);
    const responseObjects = await this.employeeService.findMany(employeePageableDto, employeeSelectSchemaPageable);
    return ResponseHandler<IPageableResponse<EmployeeOptionalDto[]>>(HttpStatus.OK, responseObjects);
  }

  @UseGuards(AuthoritiesGuard([Authority.ROOT, Authority.DATA_SUPPORT]))
  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<IResponseHandler<string>> {
    await this.employeeService.deleteOne(Number(id));
    return ResponseHandler<string>(HttpStatus.OK, 'Employee has been removed');
  }

  @UseGuards(AuthoritiesGuard([Authority.ROOT, Authority.DATA_SUPPORT]))
  @Put(':id')
  async updateOne(@Body() updateEmployeeDto: UpdateEmployeeDto, @Param('id') id: string): Promise<IResponseHandler<string>> {
    await this.employeeService.updateOne(updateEmployeeDto, Number(id));
    return ResponseHandler<string>(HttpStatus.OK, 'Employee has been updated');
  }
}
