import { PrismaErrorHandler } from './../../prisma-client/PrismaErrorHandler';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { PostCreateUserDto } from './dtos/post.create-user.dto';
import { ClientJwtService } from './client-jwt.service';
import { IClientJwtPayload } from './../shared/interfaces/IClientJwtPayload';
import { GetUniquePropertyDto, UserUniquePropertyEnum } from './../user/dtos/get.unique-property.dto';
import { UserLoginDataDto } from './dtos/user-login-data.dto';
import { UserService } from './../user/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ClientIsActive, User } from '@prisma/client';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly clientJwtService: ClientJwtService,
    private readonly prismaClientService: PrismaClientService,
  ) {}

  signToken(data: IClientJwtPayload) {
    const { accessToken } = this.clientJwtService.login(data);
    return { access_token: accessToken };
  }

  async validateUserEmailAndPassword(userLoginDataDto: UserLoginDataDto): Promise<User> {
    const findByPayload: GetUniquePropertyDto = {
      propertyName: UserUniquePropertyEnum.email,
      propertyValue: userLoginDataDto.email
    }
    const user = await this.userService.findByUniqueProperty(findByPayload);
    if(user && (await bcrypt.compare(userLoginDataDto.password, user.password))) {
      return user;
    }
    throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }


  async register(postCreateUserDto: PostCreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(postCreateUserDto.password, 10);
    if(!hashedPassword) throw new HttpException(
      'Error at creating account, please raport it to support',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
    try {
      return await this.prismaClientService.user.create({
        data: {
          username: postCreateUserDto.username,
          password: hashedPassword,
          email: postCreateUserDto.email,
          firstName: postCreateUserDto.firstName,
          lastName: postCreateUserDto.lastName,
          isActive: ClientIsActive.EMAIL_VERIFICATION,
          lang: postCreateUserDto.lang,
          accountType: postCreateUserDto.accountType,
          userDetails: {
            create: {
              profileImg: postCreateUserDto.profileImg,
              age: postCreateUserDto.age,
              gender: postCreateUserDto.gender,
              createdAt: new Date(),
              userAddress: {
                create: {
                  country: postCreateUserDto.country,
                  city: postCreateUserDto.city,
                  zipCode: postCreateUserDto.zipCode,
                  address1: postCreateUserDto.address1,
                  address2: postCreateUserDto.address2,
                }
              }
            }
          }
        }
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }

  }

}
