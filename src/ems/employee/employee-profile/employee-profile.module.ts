import { EmployeeModule } from './../employee.module';
import { Module } from '@nestjs/common';
import { EmployeeProfileService } from './employee-profile.service';
import { EmployeeProfileController } from './employee-profile.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  imports: [PrismaClientModule, EmployeeModule],
  controllers: [EmployeeProfileController],
  providers: [EmployeeProfileService]
})
export class EmployeeProfileModule {}
