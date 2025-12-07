import { IsEmail, IsString, IsOptional } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  code: string;

  @IsOptional()
  rememberDevice?: boolean;

  @IsOptional()
  @IsString()
  deviceId?: string;
}
