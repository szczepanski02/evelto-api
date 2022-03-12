import { EmployeeService } from './../../employee/employee.service';
import { ResponseHandler, IResponseHandler } from './../../shared/others/responseHandler';
import { Controller, Param, Delete, HttpStatus, Get, HttpException } from '@nestjs/common';
import { AuthIpsService } from './auth-ips.service';
import { IdValidator } from 'src/shared/others/idValidator';
import { VerificatedIP } from '@prisma/client';

@Controller('auth-ips')
export class AuthIpsController {
  constructor(
    private readonly authIpsService: AuthIpsService,
    private readonly employeeService: EmployeeService
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
    const employee = await this.employeeService.getEmployeeWithRelations(+employeeId);
    if(!employee) throw new HttpException('Cannot find employee', HttpStatus.BAD_REQUEST);
    const verificatedIPs = employee.verificatedIPs.map((obj: VerificatedIP) => {
      return { id: obj.id, address: obj.address };
    });
    return ResponseHandler<{ id: number, address: string }[]>(HttpStatus.OK, verificatedIPs);
  }

}
