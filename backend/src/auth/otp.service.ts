import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class OtpService {
  constructor(private mailer: MailerService) {}

  generateCode(): string {
    // 6 chiffres
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(email: string, code: string, context: 'register' | 'login') {
    const subject =
      context === 'register'
        ? 'Votre code de vérification (inscription)'
        : 'Votre code de connexion (MFA)';

    await this.mailer.sendMail({
      to: email,
      subject,
      html: `
        <h1>Votre code OTP</h1>
        <p>Voici votre code :</p>
        <h2>${code}</h2>
        <p>Il expire dans 5 minutes.</p>
      `,
    });
  }
  async sendMagicLink(email: string, url: string) {
    await this.mailer.sendMail({
      to: email,
      subject: 'Réinitialisation du mot de passe',
      html: `
        <h1>Réinitialisation du mot de passe</h1>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${url}" style="color: blue; font-weight: bold;">
          Réinitialiser mon mot de passe
        </a>
        <p>Ce lien est valable pendant 15 minutes.</p>
      `,
    });
  }
}
