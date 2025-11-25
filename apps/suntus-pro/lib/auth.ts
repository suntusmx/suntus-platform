import { auth0, auth0Config } from './auth0';
import { setAccessToken, removeAccessToken, api } from './api';

/**
 * Servicio de autenticación para suntus-pro
 * Maneja el flujo completo de Auth0 y sincronización con backend
 */

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'CLIENT' | 'EXPERT';
  language: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Inicia sesión con Auth0
 */
export async function login(): Promise<AuthUser> {
  try {
    // 1. Autenticar con Auth0
    const credentials = await auth0.webAuth.authorize({
      scope: 'openid profile email',
      audience: auth0Config.audience,
    });

    if (!credentials.idToken) {
      throw new Error('No se recibió token de Auth0');
    }

    // 2. Enviar token al backend para sincronizar y obtener token interno
    const response = await api.post<{ accessToken: string; user: AuthUser }>(
      '/auth/callback',
      { token: credentials.idToken }
    );

    // 3. Guardar token interno
    await setAccessToken(response.accessToken);

    return response.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Cierra sesión
 */
export async function logout(): Promise<void> {
  try {
    // 1. Limpiar sesión de Auth0
    await auth0.webAuth.clearSession();
    
    // 2. Eliminar token interno
    await removeAccessToken();
  } catch (error) {
    console.error('Logout error:', error);
    // Continuar aunque falle Auth0
    await removeAccessToken();
  }
}

/**
 * Obtiene el usuario actual desde el backend
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await api.get<AuthUser>('/auth/me');
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Verifica si hay una sesión activa
 */
export async function checkAuth(): Promise<AuthUser | null> {
  const token = await import('./api').then(m => m.getAccessToken());
  if (!token) {
    return null;
  }

  return getCurrentUser();
}

