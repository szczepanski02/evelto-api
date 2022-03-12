import { ResponseHandler, IResponseHandler } from './../../shared/others/responseHandler';
import { Controller, Param, Post, Delete, HttpStatus } from '@nestjs/common';
import { AuthIpsService } from './auth-ips.service';
import { IdValidator } from 'src/shared/others/idValidator';

@Controller('auth-ips')
export class AuthIpsController {
  constructor(private readonly authIpsService: AuthIpsService) {}

  @Delete(':verificatedId')
  async deleteOne(@Param('verificatedId') id: string): Promise<IResponseHandler<string>> {
    IdValidator(+id);
    await this.authIpsService.deleteOne(+id);
    return ResponseHandler<string>(HttpStatus.OK, 'Verificated IP has been removed');
  }

}
