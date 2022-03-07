import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { PrismaClientModule } from './prisma-client/prisma-client.module';

@Module({
  imports: [AuthModule, EmployeeModule, PrismaClientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
