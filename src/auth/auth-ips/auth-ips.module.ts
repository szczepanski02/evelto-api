import { PrismaClientModule } from './../../prisma-client/prisma-client.module';
import { Module } from '@nestjs/common';
import { AuthIpsService } from './auth-ips.service';
import { AuthIpsController } from './auth-ips.controller';

@Module({
  imports: [PrismaClientModule],
  controllers: [AuthIpsController],
  providers: [AuthIpsService],
  exports: [AuthIpsService]
})
export class AuthIpsModule {}
