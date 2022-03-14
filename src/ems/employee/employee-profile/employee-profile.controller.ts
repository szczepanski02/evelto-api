import { IReqWithEmployeeCredentials } from './../../shared/interfaces/IReqWithEmployeeCredentials';
import { IResponseHandler, ResponseHandler } from '../../../helpers/responseHandler';
import { PasswordUpdateDto } from './dtos/password-update.dto';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Put, Request, UseGuards, Response, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmployeeProfileService } from './employee-profile.service';
import { AuthoritiesGuard } from '../../shared/guards/authorities.guard';
import { Observable, of } from 'rxjs';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerEmployeeAvatarConfig } from '../../config/multer-employee-avatar.config';

@Controller('ems/employee-profile')
export class EmployeeProfileController {
  constructor(private readonly employeeProfileService: EmployeeProfileService) {}

  @UseGuards(AuthoritiesGuard())
  @Put('/password')
  async updateEmployeePassword(
    @Body() passwordUpdateDto: PasswordUpdateDto,
    @Request() req: IReqWithEmployeeCredentials,
  ): Promise<IResponseHandler<string>> {
    await this.employeeProfileService.updatePassword(passwordUpdateDto, req.user.id);
    return ResponseHandler(HttpStatus.OK, 'Password has been updated');
  }

  @UseGuards(AuthoritiesGuard())
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar', multerEmployeeAvatarConfig))
  async setAvatar(
    @UploadedFile() file: any,
    @Request() req: IReqWithEmployeeCredentials,
  ) {
    if (!file) {
      throw new HttpException(
        'Image is required to set new avatar',
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this.employeeProfileService.setAvatar(
      req.user.id,
      file.filename,
    );
    if (result) {
      return ResponseHandler<string>(
        HttpStatus.OK,
        'Profile image has been setted successfully',
      );
    }
    throw new HttpException(
      "We've got some problem with server, please raport it to ROOT",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @UseGuards(AuthoritiesGuard())
  @Get('/avatar/:id?')
  async getAvatar(
    @Request() req: IReqWithEmployeeCredentials,
    @Response() res: any,
    @Param('id') id: string,
  ): Promise<Observable<any>> {
    let idToSend: number;
    if (id) idToSend = +id;
    else idToSend = req.user.id;
    const result = await this.employeeProfileService.getAvatar(idToSend);
    try {
      if (fs.existsSync(result)) {
        return of(res.sendFile(result));
      }
      throw new HttpException(
        'Cannot get employee profile image, file is not exists',
        HttpStatus.NO_CONTENT,
      );
    } catch (err) {
      throw new HttpException(
        'Cannot get employee profile image, file is not exists',
        HttpStatus.NO_CONTENT,
      );
    }
  }

}
