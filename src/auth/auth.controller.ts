import { JwtPayloadDto } from './dtos/jwt-payload.dto';
import { IReqWithEmployeeCredentials } from './../shared/interfaces/IReqWithEmployeeCredentials';
import { IResponseHandler, ResponseHandler } from './../shared/others/responseHandler';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Controller, HttpCode, Post, UseGuards, HttpStatus, Req, HttpException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthoritiesGuard } from 'src/shared/guards/authorities.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Req() req: any): Promise<IResponseHandler<{ access_token: string }>> {
    const responseObject = await this.authService.signin(req.user);
    if(!responseObject) {
      throw new HttpException(
        'Some problem with server authorization, please raport it to IT Support',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
    return ResponseHandler<{ access_token: string }>(HttpStatus.OK, responseObject);
  }

  @UseGuards(AuthoritiesGuard())
  @Get('/authorize')
  async authorize(@Req() req: IReqWithEmployeeCredentials): Promise<IResponseHandler<JwtPayloadDto>> {
    if(req.user) {
      return ResponseHandler<JwtPayloadDto>(HttpStatus.OK, req.user);
    }
    throw new HttpException('Unauthorizated user', HttpStatus.UNAUTHORIZED);
  }

}
