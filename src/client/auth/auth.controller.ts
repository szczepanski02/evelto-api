import { PostCreateUserDto } from './dtos/post.create-user.dto';
import { ResponseHandler, IResponseHandler } from '../../helpers/responseHandler';
import { IAuthorizatedUser } from './../shared/interfaces/IAuthorizatedUser';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Controller, Post, Req, UseGuards, HttpException, HttpStatus, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('client/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: IAuthorizatedUser): Promise<IResponseHandler<{ access_token: string }>> {
    const responseObject = this.authService.signToken({
      id: req.user.id,
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      lang: req.user.lang,
      accountType: req.user.accountType
    });
    if(!responseObject) {
      throw new HttpException('Cannot sign in, please contact with administrator', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return ResponseHandler<{ access_token: string }>(HttpStatus.OK, responseObject);
  }

  @Post('/register')
  async register(@Body() postCreateUserDto: PostCreateUserDto): Promise<IResponseHandler<string>> {
    const responseObject = await this.authService.register(postCreateUserDto);
    if(responseObject) {
      return ResponseHandler<string>(HttpStatus.CREATED, 'Account has been created successfully');
    }
  }

}
