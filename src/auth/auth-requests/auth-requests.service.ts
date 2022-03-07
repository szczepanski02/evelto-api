import { EmployeeService } from './../../employee/employee.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRequestsService {
  constructor(
    private readonly employeeService: EmployeeService
  ) {}
}
