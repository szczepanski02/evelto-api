import { ResponseHandler } from './../../../shared/others/responseHandler';
import { PasswordUpdateDto } from './../dtos/password-update.dto';
import { employeesMock } from "../../__tests__/employees.mock";
import * as httpMocks from 'node-mocks-http';
import { EmployeeProfileController } from "../employee-profile.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { EmployeeProfileService } from "../employee-profile.service";
import { AuthoritiesGuard } from "../../../shared/guards/authorities.guard";
import { HttpStatus } from '@nestjs/common';

describe('EmployeeProfileController', () => {
  let controller: EmployeeProfileController;

  const mockRequest: any = httpMocks.createRequest();
  mockRequest.user = {
    username: employeesMock[0].username,
    id: employeesMock[0].id,
    firstName: employeesMock[0].firstName,
    lastName: employeesMock[0].lastName,
    authority: employeesMock[0].authority
  };

  const employeeProfileServiceMock = {
    getEmployeeByUsername(username: string, selectString: string) {
      return employeesMock.filter(employee => employee.username === username)[0];
    },
    findById(id: number) {
      return employeesMock.filter(employee => employee.id === id)[0];
    },
    updatePassword(passwordUpdateDto: PasswordUpdateDto, id: number) {
      return employeesMock.map(employee => {
        if(employee.id === id) {
          employee.password = passwordUpdateDto.newPassword
        }
        return;
      });
    }

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeProfileController],
      providers: [
        EmployeeProfileService,
        { provide: AuthoritiesGuard, useValue: jest.fn().mockImplementation(() => true) }
      ],
    })
      .overrideProvider(EmployeeProfileService).useValue(employeeProfileServiceMock)
      .compile();

    controller = module.get<EmployeeProfileController>(EmployeeProfileController);
  });

  it('should be controller defined', () => {
    expect(controller).toBeDefined();
  });

  describe('PUT employee-profile/password', () => {
    it('should return success response after password changed', async () => {
      const passwordUpdateDto = { password: 'xyz', newPassword: 'newPass' };
      expect(await controller.updateEmployeePassword(passwordUpdateDto, mockRequest)).toEqual(
        ResponseHandler(HttpStatus.OK, 'Password has been updated')
      )
    });
  });
});