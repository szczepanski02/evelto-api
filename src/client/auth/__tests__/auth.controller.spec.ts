import { ResponseHandler } from './../../../helpers/responseHandler';
import { UserTokensDto } from './../dtos/user-tokens.dto';
import { AccountType, ClientIsActive } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { AccountTypeGuard } from './../../shared/guards/authorities.guard';
import * as httpMocks from 'node-mocks-http';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockRequest: any = httpMocks.createRequest();
  const mockResponse: any = httpMocks.createResponse();
  mockRequest.user = {
    username: 'test',
    isActive: ClientIsActive.IS_ACTIVE,
  };

  const authServiceMock = {
    async signToken(): Promise<UserTokensDto> {
      return {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c[ij2[0',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWRhc2FzZCIsIm5hbWUiOiJhc2QgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.HRzPrDd0_oKkRpSoK90ovzVtOw4Lw1iIOWbx0RNFDd0',
        accountType: AccountType.CREATOR,
      };
    },
    async userHasRefreshTokenAtLogin(): Promise<void> {
      return;
    },
  };

  // await this.authService.userHasRefreshTokenAtLogin(req, req.user.id);
  // return res.send(
  //   ResponseHandler<UserTokensDto>(HttpStatus.OK, {
  //     access_token: responseObject.access_token,
  //     refresh_token: responseObject.refresh_token,
  //     accountType: req.user.accountType,
  //   }),
  // );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AccountTypeGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: I18nService,
          useValue: {},
        },
      ],
    })
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be controller defined', () => {
    expect(controller).toBeDefined();
  });
});
