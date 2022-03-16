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
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: any, @Res() res: any): Promise<IResponseHandler<string>> {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAdress || req.connection.socket || '0.0.0.0';
    const responseObject = await this.authService.signToken({
      id: req.user.id,
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      lang: req.user.lang,
      accountType: req.user.accountType
    }, { userId: req.user.id, ipAddress }
    );
    if(!responseObject) {
      throw new HttpException('Cannot sign in, please contact with administrator', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.authService.userHasRefreshTokenAtLogin(req, req.user.id);
    
    res.cookie('access_token', responseObject.access_token, {
      httpOnly: true,
    })
    res.cookie('refresh_token', responseObject.refresh_token, {
      httpOnly: true,
    })
    return res.send(ResponseHandler<string>(HttpStatus.OK, 'Sign in successfully'));
  }

  @Post('/register')
  async register(@Body() postCreateUserDto: PostCreateUserDto): Promise<IResponseHandler<string>> {
    const responseObject = await this.authService.register(postCreateUserDto);
    if(responseObject) {
      return ResponseHandler<string>(HttpStatus.CREATED, 'Account has been created successfully');
    }
  }

  @UseGuards(AccountTypeGuard())
  @Get('/logout')
  async logout(@Req() req: IAuthorizatedUser): Promise<IResponseHandler<string>> {
    await this.authService.removeRefreshTokenByToken(req.cookies['refresh_token'], req.user.id);
    req.res.setHeader('Set-Cookie', [
      'access_token=; HttpOnly; Path=/; Max-Age=0',
      'refresh_token=; HttpOnly; Path=/; Max-Age=0'
    ]);
    return ResponseHandler<string>(HttpStatus.UNAUTHORIZED, 'Logged out');
  }

  @UseGuards(AccountTypeGuard())
  @Delete('/refreshToken/:id')
  async removeRefreshToken(@Param('id') id: string): Promise<IResponseHandler<string>> {
    IdValidator(+id);
    await this.authService.removeRefreshTokenById(+id);
    return ResponseHandler<string>(HttpStatus.OK, 'Session has been removed');
  }

  @UseGuards(AccountTypeGuard())
  @Get('/refresh')
  async refreshAccessToken(@Req() req: any, @Res() res: any): Promise<IResponseHandler<string>> {
    if(!req.cookies['refresh_token']) throw new HttpException('Please sign in to continue', HttpStatus.UNAUTHORIZED);
    const responseObject = await this.authService.generateAccessTokenFromRefreshToken(req);
    res.cookie('access_token', responseObject.access_token, {
      httpOnly: true,
    })
    res.cookie('refresh_token', responseObject.refresh_token, {
      httpOnly: true,
    })
    return res.send(ResponseHandler<string>(HttpStatus.NO_CONTENT, 'Generated new access token'));
  }

  @UseGuards(AccountTypeGuard())
  @Get('/authorize')
  async isUserAuthorizated(@Req() req: any): Promise<IResponseHandler<IAuthorizatedUser>> {
    if(!req.user) {
      throw new HttpException('Please sign in to continue', HttpStatus.UNAUTHORIZED);
    }
    return ResponseHandler<IAuthorizatedUser>(HttpStatus.OK, req.user);
  }

}
