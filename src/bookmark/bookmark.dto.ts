import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class NewBookmarkDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;
}

export class UpdateBookmarkDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  link: string;
}