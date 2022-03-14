import { JwtPayloadDto } from './dtos/jwt-payload.dto';
import { IReqWithEmployeeCredentials } from '../shared/interfaces/IReqWithEmployeeCredentials';
import { IResponseHandler, ResponseHandler } from '../../helpers/responseHandler';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Controller, HttpCode, Post, UseGuards, HttpStatus, Req, HttpException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthoritiesGuard } from '../shared/guards/authorities.guard';

@Controller('ems/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Req() req: any): Promise<IResponseHandler<{ access_token: string }>> {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAdress || req.connection.socket || null;
    const responseObject = await this.authService.signin(req.user, reqIp);
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
