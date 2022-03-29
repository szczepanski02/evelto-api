import { Lang } from '.prisma/client';
import { IsNotEmpty, IsString } from "class-validator";

export class PutLangDto {
  @IsNotEmpty()
  @IsString()
  lang: Lang;
}