import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmployeeDto {

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsBoolean()
  @IsNotEmpty()
  ipVerification: boolean;
}