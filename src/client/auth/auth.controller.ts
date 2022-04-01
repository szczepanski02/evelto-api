import { I18nLang, I18nService } from 'nestjs-i18n';
import { ClientIsActive } from '@prisma/client';
import { getClientId } from './../shared/helpers/getClientId';
import { UserTokensDto } from './dtos/user-tokens.dto';
import { IAuthorizatedUser } from './../shared/interfaces/IAuthorizatedUser';
import { AccountTypeGuard } from './../shared/guards/authorities.guard';
import { IdValidator } from './../../helpers/idValidator';
import { PostCreateUserDto } from './dtos/post.create-user.dto';
import { ResponseHandler, IResponseHandler } from '../../helpers/responseHandler';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Controller, Post, Req, UseGuards, HttpException, HttpStatus, Body, HttpCode, Delete, Param, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('client/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private i18n: I18nService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: any, @Res() res: any, @I18nLang() lang: string): Promise<IResponseHandler<UserTokensDto>> {
    const responseObject = await this.authService.signToken({
      id: req.user.id,
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      lang: req.user.lang,
      accountType: req.user.accountType,
      isActive: req.user.isActive
    }, { userId: req.user.id, ipAddress: getClientId(req) }
    );
    if(!responseObject) {
      throw new HttpException(await this.i18n.translate('auth.cannotSignIn', { lang }), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    if(req.user.isActive === ClientIsActive.BLOCKED) {
      throw new HttpException(await this.i18n.translate('auth.accountIsBlocked', { lang }), HttpStatus.UNAUTHORIZED);
    }

    if(req.user.isActive === ClientIsActive.EMAIL_VERIFICATION) {
      throw new HttpException(await this.i18n.translate('auth.verifyYourEmail', { lang }), HttpStatus.UNAUTHORIZED);
    }

    await this.authService.userHasRefreshTokenAtLogin(req, req.user.id);
    return res.send(ResponseHandler<UserTokensDto>(HttpStatus.OK, { access_token: responseObject.access_token, refresh_token: responseObject.refresh_token, accountType: req.user.accountType }));
  }

  @Post('/register')
  async register(@Body() postCreateUserDto: PostCreateUserDto, @I18nLang() lang: string): Promise<IResponseHandler<string>> {
    const responseObject = await this.authService.register(postCreateUserDto);
    if(responseObject) {
      return ResponseHandler<string>(HttpStatus.CREATED, await this.i18n.translate('auth.accountHasBeenCreated', { lang }));
    }
  }

  @UseGuards(AccountTypeGuard())
  @Post('/logout')
  async logout(@Req() req: IAuthorizatedUser, @I18nLang() lang: string): Promise<IResponseHandler<string>> {
    await this.authService.removeRefreshTokenByToken(req.body.refresh_token, req.user.id);
    return ResponseHandler<string>(HttpStatus.OK, await this.i18n.translate('auth.loggedOut', { lang }));
  }

  // @UseGuards(AccountTypeGuard())
  @Delete('/refreshToken/:id')
  async removeRefreshToken(@Param('id') id: string, @I18nLang() lang: string): Promise<IResponseHandler<string>> {
    IdValidator(+id);
    await this.authService.removeRefreshTokenById(+id);
    return ResponseHandler<string>(HttpStatus.OK, await this.i18n.translate('auth.sessionRemoved', { lang }));
  }

  // @UseGuards(AccountTypeGuard())
  @Post('/refresh')
  async refreshAccessToken(@Req() req: any): Promise<IResponseHandler<UserTokensDto>> {
    if(!req.body.refresh_token) throw new HttpException('no session', HttpStatus.UNAUTHORIZED);
    const responseObject = await this.authService.generateAccessTokenFromRefreshToken(req);
    return ResponseHandler<UserTokensDto>(HttpStatus.OK, { access_token: responseObject.access_token, refresh_token: responseObject.refresh_token });
  }

  @UseGuards(AccountTypeGuard())
  @Get('/authorize')
  async isUserAuthorizated(@Req() req: any, @I18nLang() lang: string): Promise<IResponseHandler<IAuthorizatedUser>> {
    if(!req.user) {
      throw new HttpException(await this.i18n.translate('auth.signInToContinue', { lang }), HttpStatus.UNAUTHORIZED);
    }
    return ResponseHandler<IAuthorizatedUser>(HttpStatus.OK, req.user);
  }

}
