import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { AuthService } from '../auth.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<JwtPayloadDto> {
    const employee = await this.authService.validateSignInRequest(username, password);
    if(!employee) {
      throw new HttpException(
        'Invalid password or username',
        HttpStatus.UNAUTHORIZED
      )
    }
    return employee;
  }

}