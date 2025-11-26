import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de callback de Auth0
   * El frontend envía el token de Auth0 y nosotros lo validamos
   * @param body - Body con token de Auth0
   * @param body.token - Token JWT de Auth0
   * @returns Token interno y datos del usuario
   */
  @Public()
  @Post('callback')
  async auth0Callback(@Body() body: { token: string }) {
    // Validar token de Auth0
    const auth0User = await this.authService.validateAuth0Token(body.token);

    // Sincronizar usuario en BD
    const user = await this.authService.syncUserFromAuth0({
      sub: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name,
      picture: auth0User.picture,
    });

    // Generar tokens (access + refresh)
    const accessToken = await this.authService.generateInternalToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        language: user.language,
      },
    };
  }

  /**
   * Endpoint para obtener perfil del usuario autenticado
   * Requiere autenticación JWT válida
   * @param user - Usuario inyectado por @CurrentUser() decorator
   * @returns Datos del usuario autenticado
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      language: user.language,
    };
  }

  /**
   * Endpoint para refrescar el access token usando un refresh token
   * @param body - Body con refresh token
   * @param body.refreshToken - Refresh token válido
   * @returns Nuevo access token y refresh token
   */
  @Public()
  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    const tokens = await this.authService.refreshAccessToken(body.refreshToken);
    return tokens;
  }
}

