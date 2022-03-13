import * as httpMocks from 'node-mocks-http';
import { employeesMock } from "../../../employee/__tests__/employees.mock";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthoritiesGuard } from "../../../shared/guards/authorities.guard";
import { AuthRequestsController } from '../auth-requests.controller';
import { AuthRequestsService } from '../auth-requests.service';

describe('AuthRequestsController', () => {
  let controller: AuthRequestsController;

  const mockRequest: any = httpMocks.createRequest();
  mockRequest.user = {
    username: employeesMock[0].username,
    id: employeesMock[0].id,
    firstName: employeesMock[0].firstName,
    lastName: employeesMock[0].lastName,
    authority: employeesMock[0].authority
  };

  const authRequestsServiceMock = {
    findById(id: number) {
      return employeesMock.filter(employee => employee.id === id)[0];
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthRequestsController],
      providers: [
        AuthRequestsService,
        { provide: AuthoritiesGuard, useValue: jest.fn().mockImplementation(() => true) }
      ],
    })
      .overrideProvider(AuthRequestsService).useValue(authRequestsServiceMock)
      .compile();

    controller = module.get<AuthRequestsController>(AuthRequestsController);
  });

  it('should be controller defined', () => {
    expect(controller).toBeDefined();
  });
});