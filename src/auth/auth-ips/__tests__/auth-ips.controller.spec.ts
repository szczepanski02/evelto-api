import { AuthIpsController } from "../auth-ips.controller";
import * as httpMocks from 'node-mocks-http';
import { employeesMock } from "../../../employee/__tests__/employees.mock";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthIpsService } from "../auth-ips.service";
import { AuthoritiesGuard } from "../../../shared/guards/authorities.guard";

describe('AuthIpsController', () => {
  let controller: AuthIpsController;

  const mockRequest: any = httpMocks.createRequest();
  mockRequest.user = {
    username: employeesMock[0].username,
    id: employeesMock[0].id,
    firstName: employeesMock[0].firstName,
    lastName: employeesMock[0].lastName,
    authority: employeesMock[0].authority
  };

  const authIpsServiceMock = {
    findById(id: number) {
      return employeesMock.filter(employee => employee.id === id)[0];
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthIpsController],
      providers: [
        AuthIpsService,
        { provide: AuthoritiesGuard, useValue: jest.fn().mockImplementation(() => true) }
      ],
    })
      .overrideProvider(AuthIpsService).useValue(authIpsServiceMock)
      .compile();

    controller = module.get<AuthIpsController>(AuthIpsController);
  });

  it('should be controller defined', () => {
    expect(controller).toBeDefined();
  });
});