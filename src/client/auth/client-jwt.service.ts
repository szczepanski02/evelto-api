import { IClientRefreshJwtPayload } from './../shared/interfaces/IClientRefreshJwtPayload';
import { PrismaErrorHandler } from './../../prisma-client/PrismaErrorHandler';
import { PrismaClientService } from '../../prisma-client/prisma-client.service';
import { IClientJwtPayload } from './../shared/interfaces/IClientJwtPayload';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';
// import { Cache } from 'cache-manager';

@Injectable()
export class ClientJwtService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaClientService: PrismaClientService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  login(data: IClientJwtPayload) {
    const tokenPayload: IClientJwtPayload = {
      id: data.id,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      accountType: data.accountType,
      lang: data.lang,
      isActive: data.isActive
    };

    const refreshTokenPayload = {
      id: data.id
    }
    return {
      accessToken: this.jwtService.sign(tokenPayload, {
        secret: process.env.CLIENT_JWT_SECRET_KEY,
        expiresIn: '15m'
      }),
      refreshToken: this.jwtService.sign(refreshTokenPayload, {
        secret: process.env.CLIENT_JWT_REFRESH_SECRET_KEY,
      })
    };
  }

  async getUserTokensList(userId: string) {
    try {
      return await this.prismaClientService.refreshToken.findMany({
        where: { userId }
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  getUserIdFromRefreshToken(refreshToken: string): string {
    const decoded = this.jwtService.decode(refreshToken) as IClientRefreshJwtPayload;
    if(decoded) {
      return decoded.id;
    }
    return null;
  }

  async removeRefreshTokenById(id: number) {
    try {
      await this.prismaClientService.refreshToken.delete({
        where: { id }
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async removeRefreshTokenByToken(refreshToken: string, clientId: string): Promise<void> {
    const user = await this.prismaClientService.user.findUnique({
      where: { id: clientId },
      include: { refreshTokens: true }
    });
    if(!user) return null;
    const refreshTokenObj = user.refreshTokens.filter((el: RefreshToken) => el.token === refreshToken);
    if(refreshTokenObj[0]) {
      try {
        await this.prismaClientService.refreshToken.delete({
          where: { id: refreshTokenObj[0].id }
        })
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  // async addAccessTokenToBlacklist(access_token: string, isBlocked: boolean): Promise<void> {
  //   await this.cacheManager.set(access_token, isBlocked, { ttl: 900000 }); // 15min
  // }

  // async checkIsTokenExistInBlacklist(access_token: string): Promise<boolean> {
  //   const value = await this.cacheManager.get(access_token);
  //   if(value) {
  //     return true;
  //   }
  //   return false;
  // }

}
