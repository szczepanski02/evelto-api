import { AuthRequestsService } from './auth-requests/auth-requests.service';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';
import { Employee } from './../../node_modules/.prisma/client/index.d';
import { EmployeeService } from './../employee/employee.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
    private readonly authRequestsService: AuthRequestsService
  ) {}

  async validateSignInRequest(username: string, password: string): Promise<Employee | null> { 
    const employee = await this.employeeService.findByUsername(username);
    if(employee && await bcrypt.compare(password, employee.password)) {
      return employee;
    }
    return null;
  }

  async signin(jwtPayload: JwtPayloadDto, ip: string) {
    if(!ip) ip = '127.0.0.1';
    await this.authorizeConnection(jwtPayload.id, ip);
    const payload = {
      id: jwtPayload.id,
      username: jwtPayload.username,
      firstName: jwtPayload.firstName,
      lastName: jwtPayload.lastName,
      authority: jwtPayload.authority
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async authorizeConnection(id: number, address: string): Promise<true> {
    const employee = await this.employeeService.getEmployeeWithRelations(id);
    if(!employee) {
      throw new HttpException('Error at user authorization', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if(employee.ipVerification) {
      if(!employee.ipRequests.some(req => req.address === address)) {
        await this.authRequestsService.create(address, id);
        throw new HttpException(
          'Unauthorizated connection, IP request has been created, please wait for verification',
          HttpStatus.UNAUTHORIZED
        );
      }
    }
    return true;
  }

}
