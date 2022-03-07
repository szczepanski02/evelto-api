import { JwtPayloadDto } from './dtos/jwt-payload.dto';
import { Employee } from './../../node_modules/.prisma/client/index.d';
import { EmployeeService } from './../employee/employee.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService
  ) {}

  async validateSignInRequest(username: string, password: string): Promise<Employee | null> { 
    const employee = await this.employeeService.findByUsername(username);
    if(employee && await bcrypt.compare(password, employee.password)) {
      return employee;
    }
    return null;
  }

  async signin(jwtPayload: JwtPayloadDto) {
    const payload = {
      id: jwtPayload.id,
      username: jwtPayload.username,
      firstName: jwtPayload.firstName,
      lastName: jwtPayload.lastName,
      authority: jwtPayload.authority
    };
    return { access_token: this.jwtService.sign(payload) };
  }

}
