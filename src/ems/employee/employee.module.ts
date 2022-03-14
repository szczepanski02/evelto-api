import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Module } from '@nestjs/common';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  imports: [PrismaClientModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService]
})
export class EmployeeModule {}
