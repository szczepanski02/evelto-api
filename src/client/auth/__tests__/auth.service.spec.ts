import { JwtService } from '@nestjs/jwt';
import { ClientJwtService } from './../client-jwt.service';
import { AuthService } from './../auth.service';
import { PrismaClientService } from './../../../prisma-client/prisma-client.service';
import { Test, TestingModule } from '@nestjs/testing';
import { _userDBMock } from '../../__mocks__/userDB.mock';
import { UserService } from '../../user/user.service';
import createPrismaMock from 'prisma-mock';

describe('AuthService', () => {
  let userService: AuthService;
  let prismaClientService: PrismaClientService;

  beforeEach(async () => {
    prismaClientService = await createPrismaMock();
    // init fake users
    _userDBMock.forEach((user) => {
      prismaClientService.user.create({ data: user });
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        ClientJwtService,
        PrismaClientService,
        {
          provide: JwtService,
          useValue: jest.fn(),
        },
      ],
    })
      .overrideProvider(PrismaClientService)
      .useValue(prismaClientService)
      .compile();
    userService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create new user', async () => {});
  });
});
