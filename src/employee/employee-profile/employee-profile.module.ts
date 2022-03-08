import { EmployeeModule } from './../employee.module';
import { PrismaClientModule } from './../../prisma-client/prisma-client.module';
import { Module } from '@nestjs/common';
import { EmployeeProfileService } from './employee-profile.service';
import { EmployeeProfileController } from './employee-profile.controller';

@Module({
  imports: [PrismaClientModule, EmployeeModule],
  controllers: [EmployeeProfileController],
  providers: [EmployeeProfileService]
})
export class EmployeeProfileModule {}
