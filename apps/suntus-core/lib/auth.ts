import { api, setAccessToken, removeAccessToken } from './api';

/**
 * Servicio de autenticación local para suntus-core
 * Usa email/password contra SystemAdmin (NO Auth0)
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'SUPPORT';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Inicia sesión con email/password
 * Autenticación local contra SystemAdmin (NO Auth0)
 * @param credentials - Credenciales de login
 * @param credentials.email - Email del administrador
 * @param credentials.password - Contraseña del administrador
 * @returns Usuario administrador autenticado
 * @throws Error si las credenciales son inválidas
 */
export async function login(credentials: LoginCredentials): Promise<AdminUser> {
  try {
    // TODO: Implementar endpoint de login de admin en backend
    // Por ahora, estructura base
    const response = await api.post<{ accessToken: string; user: AdminUser }>(
      '/admin/auth/login',
      credentials
    );

    // Guardar token
    setAccessToken(response.accessToken);

    return response.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Cierra sesión
 * Limpia token del backend y elimina token local
 * No lanza error si alguna operación falla
 */
export async function logout(): Promise<void> {
  try {
    // TODO: Implementar endpoint de logout en backend si es necesario
    await api.post('/admin/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Siempre eliminar token local
    removeAccessToken();
  }
}

/**
 * Obtiene el usuario actual desde el backend
 * @returns Administrador actual si hay sesión activa, null si no hay token o error
 */
export async function getCurrentUser(): Promise<AdminUser | null> {
  try {
    return await api.get<AdminUser>('/admin/auth/me');
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Verifica si hay una sesión activa
 * Comprueba si existe token en localStorage y valida con el backend
 * @returns Administrador si hay sesión válida, null en caso contrario
 */
export async function checkAuth(): Promise<AdminUser | null> {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('suntus_admin_token')
    : null;
    
  if (!token) {
    return null;
  }

  return getCurrentUser();
}

