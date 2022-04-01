import { TokensWithDataDto } from './dtos/tokens-with-data.dto';
import { PrismaErrorHandler } from './../../../prisma-client/PrismaErrorHandler';
import { ClientIsActive, User, AccountType } from '@prisma/client';
import { CreatedByStrategies, Lang } from '.prisma/client';
import { PrismaClientService } from './../../../prisma-client/prisma-client.service';
import { AuthService } from '../auth.service';
import { UserService } from './../../user/user.service';
import { IRequestUserFromGoogle } from './../../shared/interfaces/IReqUserFromGoogle';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserUniquePropertyEnum } from 'src/client/user/dtos/get.unique-property.dto';

@Injectable()
export class AuthGoogleService {

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly prismaClientService: PrismaClientService
  ) {}

  async login(req: IRequestUserFromGoogle): Promise<TokensWithDataDto> {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '0.0.0.0';
    if(!req.user) {
      throw new HttpException({ key: 'auth.cannotSignInGoogle' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const { accessToken, ...data } = req.user;
    const user = await this.userService.findByUniqueProperty(
      { propertyName: UserUniquePropertyEnum.email, propertyValue: data.email }
    );
    if(user) {
      if(user.createdBy !== CreatedByStrategies.GOOGLE) {
        throw new HttpException({ key: 'emailInUseGoogle' }, HttpStatus.UNAUTHORIZED);
      }
      const tokens = await this.authService.signToken({
        id: user.id,
        username: user.username,
        accountType: user.accountType,
        lang: user.lang,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive
      }, {
        userId: user.id,
        ipAddress: ipAddress[0] // to check
      });
      if(!tokens) {
        throw new HttpException({ key: 'auth.cannotSignInGoogle' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return { tokens, isActive: user.isActive, accountType: user.accountType, id: user.id };
    }
    return this.createNewUser(req);
  }

  async createNewUser(req: IRequestUserFromGoogle): Promise<TokensWithDataDto> {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '0.0.0.0';
    let user: User;
    try {
      user = await this.prismaClientService.user.create({
        data: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          lang: Lang.en,
          isActive: ClientIsActive.PROFILE_NOT_COMPLETE,
          createdBy: CreatedByStrategies.GOOGLE,
          accountType: AccountType.CREATOR,
          userDetails: {
            create: {
              profileImg: req.user.picture,
              createdAt: new Date()
            }
          }
        }
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
    if(user) {
      const tokens = await this.authService.signToken({
        id: user.id,
        username: 'unknown',
        accountType: user.accountType,
        lang: user.lang,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive
      }, {
        userId: user.id,
        ipAddress: ipAddress[0] // to check
      });
      if(!tokens) {
        throw new HttpException({ key: 'auth.cannotSignInGoogle' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return { tokens, isActive: user.isActive, accountType: user.accountType, id: user.id };
    }
  }

}


// id: string;
// username: string;
// accountType: AccountType;
// lang: Lang;
// firstName: string;
// lastName: string;
// isActive: ClientIsActive;

// userId
// ipAddress