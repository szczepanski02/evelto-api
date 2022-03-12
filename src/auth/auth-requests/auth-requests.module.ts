import { EmployeeModule } from './../../employee/employee.module';
import { AuthIpsModule } from './../auth-ips/auth-ips.module';
import { Module } from '@nestjs/common';
import { AuthRequestsService } from './auth-requests.service';
import { AuthRequestsController } from './auth-requests.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  imports: [PrismaClientModule, AuthIpsModule, EmployeeModule],
  controllers: [AuthRequestsController],
  providers: [AuthRequestsService],
  exports: [AuthRequestsService]
})
export class AuthRequestsModule {}
