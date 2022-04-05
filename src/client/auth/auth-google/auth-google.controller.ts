import { I18nLang, I18nService } from 'nestjs-i18n';
import { IRequestUserFromGoogle } from './../../shared/interfaces/IReqUserFromGoogle';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { Request } from 'express';
import { ClientIsActive } from '@prisma/client';
import { AuthService } from '../auth.service';
import * as dotenv from 'dotenv';
import { AuthGoogle } from '../guards/google-auth.guard';
dotenv.config();

@Controller('client/auth/auth-google')
export class AuthGoogleController {
  constructor(
    private readonly authGoogleService: AuthGoogleService,
    private readonly authService: AuthService,
    private i18n: I18nService,
  ) {}

  @Get('')
  @UseGuards(AuthGoogle)
  async login(@Req() req: Request) {}

  @Get('/redirect')
  @UseGuards(AuthGoogle)
  async googleAuthRedirect(
    @Req() req: IRequestUserFromGoogle,
    @Res() res: any,
    @I18nLang() lang: string,
  ) {
    const responseObject = await this.authGoogleService.login(req);

    if (typeof responseObject === 'object') {
      if (responseObject.isActive === ClientIsActive.BLOCKED) {
        throw new HttpException(
          await this.i18n.translate('auth.accountIsBlocked', { lang }),
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (responseObject.isActive === ClientIsActive.EMAIL_VERIFICATION) {
        throw new HttpException(
          await this.i18n.translate('auth.verifyYourEmail', { lang }),
          HttpStatus.UNAUTHORIZED,
        );
      }
      await this.authService.userHasRefreshTokenAtLogin(req, responseObject.id);
      return res.redirect(
        `${process.env.REDIRECT_WEB_LINK}?access_token=${responseObject.tokens.access_token}&&refresh_token=${responseObject.tokens.refresh_token}&&accountType=${responseObject.accountType}`,
      );
    }
    if (responseObject === 'emailInUseGoogle') {
      return res.redirect(`${process.env.REDIRECT_WEB_LINK}?error=email`);
    }
    return res.redirect(`${process.env.REDIRECT_WEB_LINK}?error=signin`);
  }
}
