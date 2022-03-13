import * as httpMocks from 'node-mocks-http';
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from '../auth.controller';
import { employeesMock } from '../../employee/__tests__/employees.mock';
import { AuthService } from '../auth.service';
import { AuthoritiesGuard } from '../../shared/guards/authorities.guard';

describe('AuthController', () => {
  let controller: AuthController;

  const mockRequest: any = httpMocks.createRequest();
  mockRequest.user = {
    username: employeesMock[0].username,
    id: employeesMock[0].id,
    firstName: employeesMock[0].firstName,
    lastName: employeesMock[0].lastName,
    authority: employeesMock[0].authority
  };

  const authServiceMock = {
    findById(id: number) {
      return employeesMock.filter(employee => employee.id === id)[0];
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: AuthoritiesGuard, useValue: jest.fn().mockImplementation(() => true) }
      ],
    })
      .overrideProvider(AuthService).useValue(authServiceMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be controller defined', () => {
    expect(controller).toBeDefined();
  });
});