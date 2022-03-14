import { EmployeeJwtAuthStrategy } from './strategies/employee-jwt-auth.strategy';
import { EmployeeLocalStrategy } from './strategies/employee-local.strategy';
import { EmployeeModule } from './../employee/employee.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthRequestsModule } from './auth-requests/auth-requests.module';

@Module({
  imports: [
    EmployeeModule,
    PassportModule,
    AuthRequestsModule,
    JwtModule.register({
      secret: `${process.env.EMS_JWT_SECRET_KEY}`,
      signOptions: { expiresIn: '15m' }
    })
  ],
  providers: [AuthService, EmployeeLocalStrategy, EmployeeJwtAuthStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
