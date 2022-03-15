import { ResponseHandler, IResponseHandler } from './../../helpers/responseHandler';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { UserManagementService } from './user-management.service';

@Controller('ems/user-management')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Get('/amount')
  async getAmountOfUsers(): Promise<IResponseHandler<number>> {
    const responseData = await this.userManagementService.getAmonutOfUserAccounts();
    return ResponseHandler<number>(HttpStatus.OK, responseData);
  }

}
