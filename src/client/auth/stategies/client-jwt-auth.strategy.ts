import { IClientJwtPayload } from '../../shared/interfaces/IClientJwtPayload';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientJwtAuthStrategy extends PassportStrategy(Strategy, 'ClientJwtAuthStrategy') {
  constructor() {
    super({
      jwtFromRequest: (req: any) => {
        if (!req || !req.cookies) return null;
        return req.cookies['access_token'];
      },
      ignoreExpiration: false,
      secretOrKey: process.env.CLIENT_JWT_SECRET_KEY
    });
  }

  async validate(payload: IClientJwtPayload): Promise<IClientJwtPayload> {
    return {
      id: payload.id,
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      accountType: payload.accountType,
      lang: payload.lang
    };
  }
}