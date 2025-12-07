import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('verify-register')
  verifyRegister(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyRegister(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('verify-login')
  verifyLogin(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyLoginOtp(dto);
  }
  // --- DÉBUT DU FLOW GOOGLE ---
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return { message: 'Redirecting to Google…' };
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req, @Res() res: Response) {
    const data = await this.auth.oauthLogin(req.user);

    const token = data.accessToken;

    return res.redirect(
      `http://localhost:5173/auth/google-callback?token=${token}`,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    return req.user; // ← l'utilisateur complet injecté par JwtStrategy
  }
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.auth.forgotPassword(email);
  }
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.auth.resetPassword(token, newPassword);
  }
  @Post('resend-otp')
  resendOtp(@Body() dto: { email: string; context: 'register' | 'login' }) {
    return this.auth.resendOtp(dto.email, dto.context);
  }
}
