import { UserTokensDto } from './dtos/user-tokens.dto';
import { RefreshToken } from './../../../node_modules/.prisma/client/index.d';
import { PrismaErrorHandler } from './../../prisma-client/PrismaErrorHandler';
import { PrismaClientService } from '../../prisma-client/prisma-client.service';
import { PostCreateUserDto } from './dtos/post.create-user.dto';
import { ClientJwtService } from './client-jwt.service';
import { IClientJwtPayload } from './../shared/interfaces/IClientJwtPayload';
import { GetUniquePropertyDto, UserUniquePropertyEnum } from './../user/dtos/get.unique-property.dto';
import { UserLoginDataDto } from './dtos/user-login-data.dto';
import { UserService } from './../user/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ClientIsActive, User } from '@prisma/client';
import { ISubjectRefreshTokenPayload } from '../shared/interfaces/ISubjectRefreshTokenPayload';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly clientJwtService: ClientJwtService,
    private readonly prismaClientService: PrismaClientService,
  ) {}

  async signToken(data: IClientJwtPayload, subject: ISubjectRefreshTokenPayload): Promise<UserTokensDto> {
    const { accessToken, refreshToken } = this.clientJwtService.login(data);
    const userTokenList = await this.clientJwtService.getUserTokensList(subject.userId);
    if(userTokenList.length > 2) { // max tokens for user is 3
      await this.clientJwtService.removeRefreshTokenById(userTokenList[0].id);
    }
    try {
      await this.prismaClientService.user.update({
        where: { id: subject.userId },
        data: {
          refreshTokens: {
            create: [
              {
                ipAddress: subject.ipAddress,
                token: refreshToken
              }
            ]
          }
        }
      })
    } catch (error) {
      PrismaErrorHandler(error);
    }
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async userHasRefreshTokenAtLogin(req: any, clientId: string) {
    if(req.cookies && req.cookies['refresh_token'] && req.cookies['refresh_token'].length > 0) {
      await this.clientJwtService.removeRefreshTokenByToken(req.cookies['refresh_token'], clientId);
    }
  }

  // it generate new access token from refresh token IF refresh token exists in user entity
  async generateAccessTokenFromRefreshToken(req: any): Promise<UserTokensDto> {
    if(req.cookies && req.cookies['refresh_token'] && req.cookies['refresh_token'].length > 0) {
      const refreshToken = req.cookies['refresh_token'];
      const userId = this.clientJwtService.getUserIdFromRefreshToken(refreshToken);
      const userWithRefreshTokens = await this.prismaClientService.user.findUnique({
        where: { id: userId },
        include: { refreshTokens: true }
      });
      if(!userWithRefreshTokens) {
        throw new HttpException('Session error, please sign in to continue', HttpStatus.UNAUTHORIZED);
      }
      const refreshTokenObj = userWithRefreshTokens.refreshTokens.find((el: RefreshToken) => el.token === refreshToken);
      if(refreshTokenObj) {
        try {
          await this.prismaClientService.refreshToken.delete({ where: { id: refreshTokenObj.id } });
        } catch (error) {
          return;
        }
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAdress || req.connection.socket || '0.0.0.0';
        return await this.signToken({
          id: userWithRefreshTokens.id,
          username: userWithRefreshTokens.username,
          accountType: userWithRefreshTokens.accountType,
          lang: userWithRefreshTokens.lang,
          firstName: userWithRefreshTokens.firstName,
          lastName: userWithRefreshTokens.lastName
        }, { ipAddress, userId: userWithRefreshTokens.id })
      }
      throw new HttpException('Please sign in to continue', HttpStatus.UNAUTHORIZED);
    }
  }

  async removeRefreshTokenByToken(refreshToken: string, clientId: string): Promise<void> {
    await this.clientJwtService.removeRefreshTokenByToken(refreshToken, clientId);
  }

  async removeRefreshTokenById(id: number): Promise<void> {
    await this.clientJwtService.removeRefreshTokenById(id);
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
