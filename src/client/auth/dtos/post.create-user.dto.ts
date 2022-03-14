import { Lang, AccountType, Gender } from '.prisma/client';
import { IsNotEmpty, IsString } from "class-validator";

export class PostCreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  lang: Lang

  @IsNotEmpty()
  @IsString()
  accountType: AccountType


  // details
  profileImg?: string;

  age?: number;

  gender?: Gender;

  // address
  country?: string;

  city?: string;

  zipCode?: number;

  address1?: string;

  address2?: string;

}