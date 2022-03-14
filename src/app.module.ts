import { EmployeeProfileModule } from './ems/employee/employee-profile/employee-profile.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './ems/auth/auth.module';
import { EmployeeModule } from './ems/employee/employee.module';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { EmsModule } from './ems/ems.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [PrismaClientModule, EmsModule, ClientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
