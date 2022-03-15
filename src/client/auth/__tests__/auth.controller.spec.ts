import { AccountTypeGuard } from './../../shared/guards/authorities.guard';
import * as httpMocks from 'node-mocks-http';
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockRequest: any = httpMocks.createRequest();
  mockRequest.user = {};

  const authServiceMock = {
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: AccountTypeGuard, useValue: jest.fn().mockImplementation(() => true) }
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