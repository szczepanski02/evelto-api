import { IClientJwtPayload } from '../../shared/interfaces/IClientJwtPayload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientJwtAuthStrategy extends PassportStrategy(Strategy, 'ClientJwtAuthStrategy') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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