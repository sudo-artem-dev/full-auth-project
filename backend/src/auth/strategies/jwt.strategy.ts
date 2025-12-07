import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    // payload.sub = id de l'utilisateur provenant du token
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    // Ce qui sera injecté dans req.user
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      role: user.role, // 🎯 Récupéré depuis la BDD → toujours à jour
      isVerified: user.isVerified,
    };
  }
}
