import { Employee } from './../../node_modules/.prisma/client/index.d';
import { ResponseHandler, IResponseHandler } from './../shared/others/responseHandler';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { Body, Controller, Post, HttpException, HttpStatus, Param, Get } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<IResponseHandler<Employee>> {
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
    return ResponseHandler<Employee>(HttpStatus.CREATED, responseObject);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<IResponseHandler<Employee>> {
    const responseObject = await this.employeeService.findById(+id);
    if(!responseObject) {
      throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);
    }
    return ResponseHandler<Employee>(HttpStatus.OK, responseObject);
  }

}
