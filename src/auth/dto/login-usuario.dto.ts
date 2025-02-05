import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
