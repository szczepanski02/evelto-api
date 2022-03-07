import { Module } from '@nestjs/common';
import { AuthRequestsService } from './auth-requests.service';
import { AuthRequestsController } from './auth-requests.controller';

@Module({
  controllers: [AuthRequestsController],
  providers: [AuthRequestsService],
  exports: [AuthRequestsService]
})
export class AuthRequestsModule {}
