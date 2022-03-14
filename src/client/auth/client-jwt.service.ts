import { IClientJwtPayload } from './../shared/interfaces/IClientJwtPayload';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientJwtService {

  constructor(private readonly jwtService: JwtService) {}

  login(data: IClientJwtPayload) {
    const payload: IClientJwtPayload = {
      id: data.id,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      accountType: data.accountType,
      lang: data.lang
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

}
