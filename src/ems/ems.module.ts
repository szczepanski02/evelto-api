import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeeProfileModule } from './employee/employee-profile/employee-profile.module';
import { EmployeeModule } from './employee/employee.module';
import { UserManagementModule } from './user-management/user-management.module';

@Module({
  imports: [AuthModule, EmployeeModule, EmployeeProfileModule, UserManagementModule],
  controllers: [],
  providers: [],
})
export class EmsModule {}
