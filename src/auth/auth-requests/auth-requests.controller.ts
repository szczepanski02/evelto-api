import { IResponseHandler, ResponseHandler } from './../../shared/others/responseHandler';
import { Controller, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthRequestsService } from './auth-requests.service';
import { IdValidator } from 'src/shared/others/idValidator';

@Controller('auth-requests')
export class AuthRequestsController {
  constructor(private readonly authRequestsService: AuthRequestsService) {}

  @Post('/accept/:requestId')
  async accept(@Param('requestId') id: string): Promise<IResponseHandler<string>> {
    IdValidator(+id);
    await this.authRequestsService.accept(+id);
    return ResponseHandler<string>(HttpStatus.OK, 'IP request has been verificated');
  }

}
