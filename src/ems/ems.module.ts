import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeeProfileModule } from './employee/employee-profile/employee-profile.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [AuthModule, EmployeeModule, EmployeeProfileModule],
  controllers: [],
  providers: [],
})
export class EmsModule {}
