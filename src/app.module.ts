import { EmployeeProfileModule } from './employee/employee-profile/employee-profile.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { PrismaClientModule } from './prisma-client/prisma-client.module';

@Module({
  imports: [AuthModule, EmployeeModule, EmployeeProfileModule, PrismaClientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
