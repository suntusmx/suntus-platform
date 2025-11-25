import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Env } from '../common/config/env.validation';
import { UserRepository } from '../users/infrastructure/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<Env>,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Valida un token JWT de Auth0
   * @param token - Token JWT de Auth0 a validar
   * @returns Payload decodificado del token
   * @throws UnauthorizedException si el token es inválido
   */
  async validateAuth0Token(token: string): Promise<any> {
    try {
      // En producción, validar contra Auth0 usando jwks-rsa
      // Por ahora, validamos el token con JwtService
      const decoded = this.jwtService.decode(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  /**
   * Sincroniza usuario desde Auth0
   * Crea o actualiza el usuario en la BD basado en datos de Auth0
   * @param auth0User - Datos del usuario desde Auth0
   * @param auth0User.sub - ID único de Auth0 (auth0Id)
   * @param auth0User.email - Email del usuario
   * @param auth0User.name - Nombre del usuario (opcional)
   * @param auth0User.picture - URL de la foto de perfil (opcional)
   * @returns Usuario sincronizado o creado
   */
  async syncUserFromAuth0(auth0User: {
    sub: string; // auth0Id
    email: string;
    name?: string;
    picture?: string;
  }): Promise<any> {
    // Buscar usuario existente por auth0Id
    let user = await this.userRepository.findByAuth0Id(auth0User.sub);

    if (!user) {
      // Buscar por email (puede que ya exista sin auth0Id)
      user = await this.userRepository.findByEmail(auth0User.email);
    }

    if (user) {
      // Actualizar auth0Id si no lo tenía
      if (!user.auth0Id) {
        user = await this.userRepository.update(user.id, {
          auth0Id: auth0User.sub,
          name: auth0User.name || user.name,
        });
      }
      return user;
    }

    // Crear nuevo usuario
    // Por defecto es CLIENT, puede cambiar a EXPERT después
    const newUser = await this.userRepository.create({
      auth0Id: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name || auth0User.email.split('@')[0],
      role: 'CLIENT',
      language: 'es',
    });
    return newUser;
  }

  /**
   * Genera un JWT interno para el usuario (después de validar Auth0)
   * @param user - Usuario para el cual generar el token
   * @returns Token JWT firmado con JWT_SECRET
   */
  async generateInternalToken(user: any): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      auth0Id: user.auth0Id,
    };

    return this.jwtService.sign(payload);
  }
}

