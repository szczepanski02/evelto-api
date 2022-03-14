import { IsNotEmpty, IsString } from "class-validator";

export class UserLoginDataDto {

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

}