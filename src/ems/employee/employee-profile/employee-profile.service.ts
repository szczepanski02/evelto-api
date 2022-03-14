import { Employee } from '.prisma/client';
import { EmployeeService } from './../employee.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PasswordUpdateDto } from './dtos/password-update.dto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { PrismaClientService } from '../../../prisma-client/prisma-client.service';
import { PrismaErrorHandler } from '../../../prisma-client/PrismaErrorHandler';

@Injectable()
export class EmployeeProfileService {
  constructor(
    private prismaClientService: PrismaClientService,
    private employeeService: EmployeeService
  ) {}

  async updatePassword(passwordUpdateDto: PasswordUpdateDto, id: number): Promise<Employee> {
    let employee = await this.employeeService.findById(id);
    if(employee && await bcrypt.compare(passwordUpdateDto.password, employee.password)) {
      const hashedPassword = await bcrypt.hash(passwordUpdateDto.newPassword, 10);
      if(!hashedPassword) {
        throw new HttpException(
          'Cannot update password, please raport it to IT Support',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
      try {
        return await this.prismaClientService.employee.update({
          where: { id: employee.id },
          data: {
            password: hashedPassword
          }
        })
      } catch (error) {
        PrismaErrorHandler(error);
      }
    }
    throw new HttpException(
      'Typed password is incorrect',
      HttpStatus.BAD_REQUEST
    )
  }

  async removeAvatarFromServer(filename: string): Promise<boolean> {
    const path = this.getAvatarPath(filename);
    try {
      if (fs.existsSync(path)) {
        fs.unlink(path, (error) => {
          if (error)
            throw new HttpException(
              'Cannot remove avatar image from server',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          return true;
        });
      }
    } catch (error) {
      throw new HttpException(
        'Cannot remove avatar image from server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return false;
  }

  async setAvatar(id: number, filename: string): Promise<Employee> {
    const subject = await this.employeeService.findById(id);
    if (!subject) {
      const removed = this.removeAvatarFromServer(filename);
      if (removed)
        throw new HttpException(
          'Employee not found, file has been removed from server',
          HttpStatus.BAD_REQUEST,
        );
      throw new HttpException(
        "Employee not found and we've got some problem with server, please raport it to ROOT",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (subject.profileImg) {
      const removed = this.removeAvatarFromServer(subject.profileImg);
      if (!removed) {
        throw new HttpException(
          'Cannot set new profile image, please raport IT with ROOT',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    try {
      return this.prismaClientService.employee.update({
        where: { id },
        data: {
          profileImg: filename
        }
      })
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async getAvatar(id: number): Promise<string> {
    const subject = await this.employeeService.findById(id)
    if (!subject) {
      throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);
    }
    if (!subject.profileImg) {
      throw new HttpException(
        'Employee has not have profile image',
        HttpStatus.NO_CONTENT,
      );
    }
    return this.getAvatarPath(subject.profileImg);
  }

  getAvatarPath(filename: string): string {
    return `${process.cwd()}/uploads/images/employee_profile/${filename}`;
  }

}
