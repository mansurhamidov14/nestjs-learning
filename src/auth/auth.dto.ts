import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpDto extends AuthDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  lastName: string;
}