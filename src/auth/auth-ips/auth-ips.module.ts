import { Module } from '@nestjs/common';
import { AuthIpsService } from './auth-ips.service';
import { AuthIpsController } from './auth-ips.controller';

@Module({
  controllers: [AuthIpsController],
  providers: [AuthIpsService],
  exports: [AuthIpsService]
})
export class AuthIpsModule {}
