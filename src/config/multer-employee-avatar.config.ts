import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { Request } from 'express';

export const multerEmployeeAvatarConfig: MulterOptions = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE || 1024 * 1024,
  },

  fileFilter(
    req: Request,
    file: Express.Multer.File,
    done: (error: Error, acceptFile: boolean) => void,
  ) {
    // if(file.size > +process.env.MAX_FILE_SIZE || 1024 * 1024) {
    //   done(new HttpException(`Max file size is 1MB`, HttpStatus.BAD_REQUEST), false);
    // }

    if (
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/png'
    ) {
      done(null, true);
    } else {
      done(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },

  storage: diskStorage({
    destination(
      Request: Request,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      const uploadPath = './uploads/images/employee_profile';
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      done(null, uploadPath);
    },
    filename(req: Request, file: any, done) {
      const filename = `${Date.now()}-${file.originalname}`;
      done(null, filename);
    },
  }),
};
