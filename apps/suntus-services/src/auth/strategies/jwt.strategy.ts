import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../common/config/env.validation';
import { UserRepository } from '../../users/infrastructure/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<Env>,
    private readonly userRepository: UserRepository,
  ) {
    // Por ahora usamos JWT simétrico (HS256) para desarrollo
    // En producción, usar RS256 con JWKS de Auth0
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'dev-secret-key-change-in-production',
      algorithms: ['HS256'],
    });
  }

  async validate(payload: any) {
    // Payload puede venir de Auth0 o de nuestro JWT interno
    let user;

    if (payload.sub && payload.sub.startsWith('auth0|')) {
      // Es un token de Auth0
      user = await this.userRepository.findByAuth0Id(payload.sub);
    } else {
      // Es nuestro token interno
      user = await this.userRepository.findById(payload.sub);
    }

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.isSuspended) {
      throw new UnauthorizedException('Usuario suspendido');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      auth0Id: user.auth0Id,
      language: user.language,
    };
  }
}

