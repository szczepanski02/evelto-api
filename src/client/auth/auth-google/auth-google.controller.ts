import { IRequestUserFromGoogle } from './../../shared/interfaces/IReqUserFromGoogle';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, HttpException, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { Request } from 'express';
import { ClientIsActive } from '@prisma/client';
import { AuthService } from '../auth.service';

@Controller('client/auth/auth-google')
export class AuthGoogleController {
  constructor(
    private readonly authGoogleService: AuthGoogleService,
    private readonly authService: AuthService
  ) {}

  @Get('')
  @UseGuards(AuthGuard('google'))
  async login(@Req() req: Request) {}

  @Get('/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: IRequestUserFromGoogle, @Res() res: any) {
    const responseObject = await this.authGoogleService.login(req);

    if(responseObject.isActive === ClientIsActive.BLOCKED) {
      throw new HttpException('Your account has been blocked', HttpStatus.UNAUTHORIZED);
    }

    if(responseObject.isActive === ClientIsActive.EMAIL_VERIFICATION) {
      throw new HttpException('Please, verify your email to sign in', HttpStatus.UNAUTHORIZED);
    }
    await this.authService.userHasRefreshTokenAtLogin(req, responseObject.id);

    return res.redirect(`http://localhost:4200/auth/third-part-auth/redirect?access_token=${responseObject.tokens.access_token}&&refresh_token=${responseObject.tokens.refresh_token}&&accountType=${responseObject.accountType}`);
  }

}
