import { IResponseHandler, ResponseHandler } from './../../shared/others/responseHandler';
import { Controller, Delete, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthRequestsService } from './auth-requests.service';
import { IdValidator } from '../../shared/others/idValidator';
import { GetAllRequestsDto } from './dtos/get.all-requests.dto';

@Controller('auth-requests')
export class AuthRequestsController {
  constructor(
    private readonly authRequestsService: AuthRequestsService
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
    const responseObjects = await this.authRequestsService.getAllIPRequestsOfEmployee(+employeeId);
    return ResponseHandler<{ id: number, address: string }[]>(HttpStatus.OK, responseObjects);
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
