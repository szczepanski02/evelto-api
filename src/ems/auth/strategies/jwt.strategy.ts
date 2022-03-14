import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.EMS_JWT_SECRET_KEY
    });
  }

  async validate(payload: JwtPayloadDto) {
    return {
      id: payload.id,
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      authority: payload.authority
    }
  }

}