import { _userDBMock } from './../../__mocks__/userDB.mock';
import { UserService } from './../user.service';
import { UserController } from './../user.controller';
import { ClientIsActive, Lang } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import * as httpMocks from 'node-mocks-http';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseHandler } from '../../../helpers/responseHandler';
import { HttpStatus, HttpException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockRequest: any = httpMocks.createRequest();
  mockRequest.user = {
    id: '1',
    username: 'j.kowalski',
    firstName: 'Jan',
    lastName: 'Kowalski',
    lang: Lang.pl,
    email: 'kowalski@domain.com',
    isActive: ClientIsActive.IS_ACTIVE,
  };
  mockRequest.user = {
    username: 'test',
    isActive: ClientIsActive.IS_ACTIVE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findByUniquePropertyWithRelations: jest.fn(),
            setLang: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be controller defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserWithRelations', () => {
    it('should return user with relations', async () => {
      const result: any = _userDBMock[0];
      result.id = 'someId';
      jest
        .spyOn(service, 'findByUniquePropertyWithRelations')
        .mockImplementation(async () => result);

      expect(await controller.getUserWithRelations(mockRequest)).toEqual(
        ResponseHandler(HttpStatus.OK, result),
      );
    });

    it('should return error if user is not exist', async () => {
      const exception = new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND,
      );
      jest
        .spyOn(service, 'findByUniquePropertyWithRelations')
        .mockRejectedValue(exception);
      await expect(
        controller.getUserWithRelations(mockRequest),
      ).rejects.toThrow(exception);
    });
  });

  describe('setLang', () => {
    it('should return success message after lang changed', async () => {
      expect(await controller.setLang({ lang: Lang.en }, mockRequest)).toEqual(
        ResponseHandler(HttpStatus.NO_CONTENT, 'Lang changed'),
      );
    });
  });
});
