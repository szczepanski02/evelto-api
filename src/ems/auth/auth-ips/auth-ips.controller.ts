import { ResponseHandler, IResponseHandler } from '../../../helpers/responseHandler';
import { Controller, Param, Delete, HttpStatus, Get } from '@nestjs/common';
import { AuthIpsService } from './auth-ips.service';
import { IdValidator } from '../../../helpers/idValidator';

@Controller('ems/auth-ips')
export class AuthIpsController {
  constructor(
    private readonly authIpsService: AuthIpsService,
  ) {}

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<IResponseHandler<string>> {
    IdValidator(+id);
    await this.authIpsService.deleteOne(+id);
    return ResponseHandler<string>(HttpStatus.OK, 'Verificated IP has been removed');
  }

  // getting all verificated IPs of employee
  @Get(':id')
  async employeeVerificatedIPs(@Param('id') employeeId: string): Promise<IResponseHandler<{ id: number, address: string }[]>> {
    IdValidator(+employeeId);
    const responseObjects = await this.authIpsService.getIPsOfEmployee(+employeeId);
    return ResponseHandler<{ id: number, address: string }[]>(HttpStatus.OK, responseObjects);
  }

}
