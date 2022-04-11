import { IsNotEmpty } from 'class-validator';
import { Gender } from '@prisma/client';
import { IsString } from 'class-validator';
export class PutUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  gender: Gender;

  birthDate?: Date;

  phoneNumber?: string;

  country?: string;

  city?: string;

  zipCode?: string;

  address1?: string;

  address2?: string;

  profileImg?: string;
}
