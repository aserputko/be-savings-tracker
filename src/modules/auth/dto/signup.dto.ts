import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
