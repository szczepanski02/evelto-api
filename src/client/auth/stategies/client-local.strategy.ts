import { Lang } from '.prisma/client';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class ClientLocalStrategy extends PassportStrategy(Strategy, 'ClientLocalStrategy') {
  constructor(
    private readonly authService: AuthService,
    ) {
    super(
      { usernameField: 'email' }
    );
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUserEmailAndPassword({ email, password });
    return user;
  }

}