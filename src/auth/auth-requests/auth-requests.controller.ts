import { EmployeeService } from './../../employee/employee.service';
import { IResponseHandler, ResponseHandler } from './../../shared/others/responseHandler';
import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthRequestsService } from './auth-requests.service';
import { IdValidator } from 'src/shared/others/idValidator';
import { IPRequest } from '@prisma/client';
import { GetAllRequestsDto } from './dtos/get.all-requests.dto';

@Controller('auth-requests')
export class AuthRequestsController {
  constructor(
    private readonly authRequestsService: AuthRequestsService,
    private readonly employeeService: EmployeeService
  ) {}

  @Post(':requestId')
  async accept(@Param('requestId') id: string): Promise<IResponseHandler<string>> {
    IdValidator(+id);
    await this.authRequestsService.accept(+id);
    return ResponseHandler<string>(HttpStatus.OK, 'IP request has been verificated');
  }

  // getting all IP requests of employee
  @Get(':id')
  async employeeIPRequests(@Param('id') employeeId: string): Promise<IResponseHandler<{ id: number, address: string }[]>> {
    IdValidator(+employeeId);
    const employee = await this.employeeService.getEmployeeWithRelations(+employeeId);
    if(!employee) throw new HttpException('Cannot find employee', HttpStatus.BAD_REQUEST);
    const requests = employee.ipRequests.map((obj: IPRequest) => {
      return { id: obj.id, address: obj.address };
    });
    return ResponseHandler<{ id: number, address: string }[]>(HttpStatus.OK, requests);
  }

  @Get()
  async getAllRequests(): Promise<IResponseHandler<GetAllRequestsDto[]>> {
    const responseObjects = await this.authRequestsService.getAll();
    return ResponseHandler<GetAllRequestsDto[]>(HttpStatus.OK, responseObjects);
  }

  @Delete(':id')
  async deleteRequest(@Param('id') id: string) {
    IdValidator(+id);
    await this.authRequestsService.deleteRequest(+id);
    return ResponseHandler<string>(HttpStatus.OK, 'IP Requests has been removed');
  }


}
