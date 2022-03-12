import { PrismaClientModule } from './../prisma-client/prisma-client.module';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaClientModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService]
})
export class EmployeeModule {}
