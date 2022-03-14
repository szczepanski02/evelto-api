import { IPageable } from './../../shared/interfaces/IPageable';
import { HttpException } from '@nestjs/common';
import { IReqWithEmployeeCredentials } from './../../shared/interfaces/IReqWithEmployeeCredentials';
import { CreateEmployeeDto } from './../dtos/create-employee.dto';
import { Authority } from '@prisma/client';
import { ResponseHandler } from '../../../helpers/responseHandler';
import { Test, TestingModule } from "@nestjs/testing";
import { EmployeeController } from "../employee.controller";
import { EmployeeService } from "../employee.service";
import * as httpMocks from 'node-mocks-http';
import { employeesMock } from "./employees.mock";
import { AuthoritiesGuard } from "../../shared/guards/authorities.guard";
import { HttpStatus } from '@nestjs/common';

describe('EmployeeController', () => {
  let controller: EmployeeController;

  const mockRequest: any = httpMocks.createRequest();
  mockRequest.user = {
    username: employeesMock[0].username,
    id: employeesMock[0].id,
    firstName: employeesMock[0].firstName,
    lastName: employeesMock[0].lastName,
    authority: employeesMock[0].authority
  };

  const employeeServiceMock = {
    getEmployeeByUsername(username: string, selectString: string) {
      return employeesMock.filter(employee => employee.username === username)[0];
    },
    create(payload: CreateEmployeeDto) {
      return {
        id: 10,
        username: payload.username,
        password: payload.password,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        isActive: true,
        authority: Authority.MODERATOR,
        ipVerification: true,
        profileImg: null,
        createdAt: new Date(),
        verificatedIPs: [],
        createdBy: payload.createdBy,
        ipRequests: []
      }
    },
    findById(id: number) {
      return employeesMock.filter(employee => employee.id === id)[0];
    },
    findMany(employeePageableDto: IPageable) {
      return employeesMock;
    }

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        EmployeeService,
        { provide: AuthoritiesGuard, useValue: jest.fn().mockImplementation(() => true) }
      ],
    })
      .overrideProvider(EmployeeService).useValue(employeeServiceMock)
      .compile();

    controller = module.get<EmployeeController>(EmployeeController);
  });

  it('should be controller defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST employee/create', () => {
    const payload = {
      username: 'newUser', firstName: 'Subject', lastName: 'User', email: 's.user@domain.com'
    }
    it('should create new employee', async () => {
      mockRequest.body = payload;
      expect(await controller.create(mockRequest.body, mockRequest)).toEqual(
        ResponseHandler(HttpStatus.CREATED, 'Employee has been created successfully')
      );
    });
  });

  describe('GET employee/:id', () => {
    it('should return user object', async () => {
      expect(await controller.findById(String(employeesMock[0].id))).toEqual(
        ResponseHandler(HttpStatus.OK, employeesMock[0])
      )
    });
    it('should return error if user is not exists', async () => {
      await expect(controller.findById('1000')).rejects.toEqual(
        new HttpException('Employee not found', HttpStatus.BAD_REQUEST)
      );
    });
    it('should return error if id is not a number', async () => {
      await expect(controller.findById('1s')).rejects.toEqual(
        new HttpException('Invalid request (I102), please contact with ID Support.', HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe('GET employee/username/:username', () => {
    it('should return user object', async () => {
      expect(await controller.findByUsername(employeesMock[0].username)).toEqual(
        ResponseHandler(HttpStatus.OK, employeesMock[0])
      )
    });
    it('should return error if user is not exists', async () => {
      await expect(controller.findByUsername('xxx')).rejects.toEqual(
        new HttpException('Employee not found', HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe('GET employee', () => {
    it('should return list of employees', async () => {
      const employeePageableDto: IPageable = {};
      expect(await controller.findMany(employeePageableDto)).toEqual(
        ResponseHandler(HttpStatus.OK, employeesMock)
      );
    });
  });
});