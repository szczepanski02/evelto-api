import { Authority } from '.prisma/client';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { Body, Controller, Post, HttpException, HttpStatus, Param, Get, Query, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeOptionalDto } from './dtos/employee-optional.dto';
import { employeeSelectSchemaPageable, employeeSelectSchemaWithoutPassword } from './employee.select-schema';
import { AuthoritiesGuard } from '../shared/guards/authorities.guard';
import { IReqWithEmployeeCredentials } from '../shared/interfaces/IReqWithEmployeeCredentials';
import { IResponseHandler, ResponseHandler } from '../../helpers/responseHandler';
import { IdValidator } from '../../helpers/idValidator';
import { pageablePayloadValidator } from '../shared/others/pageablePayloadValidator';
import { IPageable } from '../shared/interfaces/IPageable';
import { IPageableResponse } from '../shared/interfaces/IPageableResponse';

@Controller('ems/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(AuthoritiesGuard([Authority.ROOT]))
  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Req() req: IReqWithEmployeeCredentials
  ): Promise<IResponseHandler<string>> {
    // to change
    // createEmployeeDto.createdBy = 'SERVER_ROOT';
    // 
    createEmployeeDto.createdBy = req.user.username; 
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

  @Get('/username/:username')
  async findByUsername(@Param('username') username: string): Promise<any> {
    const responseObject = await this.employeeService.getEmployeeByUsername(username);
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

  @UseGuards(AuthoritiesGuard([Authority.ROOT]))
  @Put('/authority/:id')
  async updateAuthority(@Body() updateAuthority: { authority: Authority }, @Param('id') id: string) {
    await this.employeeService.changeAuthority(+id, updateAuthority);
    return ResponseHandler<string>(HttpStatus.OK, `Employee authority has been setted to ${updateAuthority.authority}`)
  }

}
