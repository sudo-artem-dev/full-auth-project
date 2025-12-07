import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwt: JwtService,
    private otpService: OtpService,
  ) {}

  // ---------- REGISTER (étape 1) ----------
  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    // 🟦 CAS 1 : l'utilisateur existe et est vérifié → erreur
    if (existingUser && existingUser.isVerified) {
      throw new ConflictException('Email déjà utilisé');
    }

    // 🟧 CAS 2 : utilisateur existe mais NON vérifié → on réinitialise
    const hashed = await bcrypt.hash(dto.password, 10);
    const code = this.otpService.generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    if (existingUser && !existingUser.isVerified) {
      // mettre à jour et renvoyer un nouveau otp
      await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          password: hashed,
          firstName: dto.firstName,
          lastName: dto.lastName,
          otpCode: code,
          otpExpiresAt: expiresAt,
        },
      });

      await this.otpService.sendOTP(dto.email, code, 'register');

      return {
        message: 'Compte existant non vérifié. Nouveau code OTP envoyé.',
      };
    }

    // 🟩 CAS 3 : nouvel utilisateur
    await this.usersService.create({
      email: dto.email,
      password: hashed,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: 'USER',
      otpCode: code,
      otpExpiresAt: expiresAt,
    });

    await this.otpService.sendOTP(dto.email, code, 'register');

    return {
      message: 'Compte créé. Un code OTP a été envoyé par mail.',
    };
  }

  // ---------- VERIFY REGISTER OTP (étape 2) ----------
  async verifyRegister(dto: VerifyOtpDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      throw new UnauthorizedException('Aucun OTP en attente');
    }

    if (user.otpExpiresAt < new Date()) {
      throw new UnauthorizedException('OTP expiré');
    }

    if (user.otpCode !== dto.code) {
      throw new UnauthorizedException('Code OTP invalide');
    }

    const updated = await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    const tokens = await this.generateTokens(
      updated.id,
      updated.email,
      updated.role,
    );

    return {
      message: 'Email vérifié, connexion réussie',
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        role: updated.role,
      },
      ...tokens,
    };
  }

  // ---------- LOGIN (étape 1 : email + password, envoi OTP) ----------
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Compte non vérifié');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // 🟢⭐ NOUVEAU : skip OTP si device connu
    if (dto.deviceId && user.trustedDevices.includes(dto.deviceId)) {
      console.log('📌 Device reconnu → connexion sans OTP');

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      return {
        message: 'Connexion réussie sans OTP',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        ...tokens,
      };
    }

    // 🟠 Sinon → OTP obligatoire
    const code = this.otpService.generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        otpCode: code,
        otpExpiresAt: expiresAt,
      },
    });

    await this.otpService.sendOTP(dto.email, code, 'login');

    return {
      message: 'OTP envoyé par email. Veuillez valider votre connexion.',
    };
  }

  // ---------- VERIFY LOGIN OTP (étape 2) ----------
  async verifyLoginOtp(dto: VerifyOtpDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      throw new UnauthorizedException('Aucun OTP en attente');
    }

    if (user.otpExpiresAt < new Date()) {
      throw new UnauthorizedException('OTP expiré');
    }

    if (user.otpCode !== dto.code) {
      throw new UnauthorizedException('Code OTP invalide');
    }

    // 🟢 ⭐ AJOUT IMPORTANT : stockage du device s'il est "de confiance"
    if (dto.rememberDevice && dto.deviceId) {
      await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          trustedDevices: {
            push: dto.deviceId,
          },
        },
      });

      console.log('📌 appareil ajouté :', dto.deviceId);
    }

    // Nettoyer l'OTP après validation
    const updated = await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    // Génération des tokens
    const tokens = await this.generateTokens(
      updated.id,
      updated.email,
      updated.role,
    );

    return {
      message: 'Connexion réussie',
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        role: updated.role,
      },
      ...tokens,
    };
  }

  // ---------- TOKENS ----------
  private async generateTokens(id: string, email: string, role: string) {
    const payload = { sub: id, email, role };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: (process.env.JWT_ACCESS_SECRET_EXPIRES_IN as any) || '1h',
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // si tu veux stocker le refreshToken (optionnel)
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }
  async oauthLogin(googleUser: any) {
    const { email, firstName, lastName, picture, googleId } = googleUser;

    let user = await this.usersService.findByEmail(email);

    // Si l’utilisateur n'existe pas → création
    if (!user) {
      user = await this.usersService.create({
        email,
        firstName,
        lastName,
        picture,
        googleId,
        password: null,
        isVerified: true,
        role: 'USER',
        otpCode: null,
        otpExpiresAt: null,
      });
    }

    // Générer les tokens
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: (process.env.JWT_ACCESS_SECRET_EXPIRES_IN as any) || '1h',
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Sauvegarde du refreshToken
    await this.usersService.updateByEmail(email, { refreshToken });

    return {
      message: 'Connexion Google réussie',
      accessToken,
      refreshToken,
      user,
    };
  }
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    // Toujours renvoyer un message neutre
    if (!user) {
      return { message: 'Si un compte existe, un email a été envoyé.' };
    }

    // Générer un token JWT valable 15 minutes
    const resetToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email },
      {
        secret: process.env.JWT_RESET_SECRET, // SECRET SÉPARÉ
        expiresIn: '15m',
      },
    );

    // Sauvegarder le token en DB
    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken },
    });

    // Magic link
    const url = `http://localhost:5173/reset-password?token=${resetToken}`;

    // Envoi de l'email
    await this.otpService.sendMagicLink(email, url);

    return { message: 'Email envoyé avec les instructions.' };
  }

  async resetPassword(token: string, newPassword: string) {
    let payload;

    try {
      payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_RESET_SECRET, // MÊME SECRET
      });
    } catch {
      throw new UnauthorizedException('Lien invalide ou expiré');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.resetPasswordToken !== token) {
      throw new UnauthorizedException('Lien invalide');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetPasswordToken: null, // invalidation du token !
      },
    });

    return { message: 'Mot de passe mis à jour, vous pouvez vous connecter.' };
  }
  async resendOtp(email: string, context: 'register' | 'login') {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Utilisateur introuvable');

    const code = this.otpService.generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: {
        otpCode: code,
        otpExpiresAt: expiresAt,
      },
    });

    await this.otpService.sendOTP(email, code, context);

    return { message: 'Nouveau code envoyé.' };
  }
}
