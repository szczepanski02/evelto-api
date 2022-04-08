import { Lang } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import { prismaMock } from './../../../prisma-client/__mocks__/singleton.mock';
import { UserUniquePropertyEnum } from './../dtos/get.unique-property.dto';
import { PrismaClientService } from './../../../prisma-client/prisma-client.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './../user.service';
import { _userDBMock } from '../../__mocks__/userDB.mock';
import { userSelectSchemaAll } from '../user.select-schema';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaClientService],
    }).compile();
    userService = module.get<UserService>(UserService);
  });

  // init fake users
  _userDBMock.forEach((user) => {
    prismaMock.user.create.mockResolvedValue(user);
  });

  describe('findByUniqueProperty', () => {
    let getUniquePropertyDto = {
      propertyName: UserUniquePropertyEnum.username,
      propertyValue: _userDBMock[0].username,
    };

    it('should return a user object finded by username', async () => {
      const user = await userService.findByUniqueProperty(getUniquePropertyDto);
      expect(user).toMatchObject({
        username: _userDBMock[0].username,
        email: _userDBMock[0].email,
        firstName: _userDBMock[0].firstName,
        lastName: _userDBMock[0].lastName,
        password: _userDBMock[0].password,
      });
    });

    it('should return null if user not found', async () => {
      getUniquePropertyDto.propertyName = UserUniquePropertyEnum.id;
      getUniquePropertyDto.propertyValue = 'someInvalidId';
      expect(
        await userService.findByUniqueProperty(getUniquePropertyDto),
      ).toEqual(null);
    });
  });

  describe('findByUniquePropertyWithRelations', () => {
    const getUniquePropertyDto = {
      propertyName: UserUniquePropertyEnum.username,
      propertyValue: _userDBMock[1].username,
    };
    it('should return a user object with relations', async () => {
      const subject = await userService.findByUniquePropertyWithRelations(
        getUniquePropertyDto,
        userSelectSchemaAll,
      );
      expect(subject).toMatchObject({ username: _userDBMock[1].username });
      expect(subject).toHaveProperty('id');
      expect(subject).toHaveProperty('userDetails');
      expect(subject).toHaveProperty('creatorDetails');
    });
    it('should return null if user is not exists', async () => {
      getUniquePropertyDto.propertyValue = 'invalidUsername';
      expect(
        await userService.findByUniquePropertyWithRelations(
          getUniquePropertyDto,
          userSelectSchemaAll,
        ),
      ).toBeNull();
    });
  });

  describe('setLang', () => {
    const getUniquePropertyDto = {
      propertyName: UserUniquePropertyEnum.username,
      propertyValue: _userDBMock[0].username,
    };
    it('should change user lang', async () => {
      const user = await userService.findByUniqueProperty(getUniquePropertyDto);
      const langBeforeUpdate = _userDBMock[0].lang;
      const langAfterUpdate = (await userService.setLang(user.id, Lang.en))
        .lang;
      expect(langAfterUpdate).not.toEqual(langBeforeUpdate);
    });
    it('should return error if lang is not valid', async () => {
      const user = await userService.findByUniqueProperty(getUniquePropertyDto);
      // @ts-ignore - lang is not a valid enum
      await expect(userService.setLang(user.id, 'invalidLang')).rejects.toEqual(
        new HttpException('Http Exception', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});
