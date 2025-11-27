import './env.validation'; // Valida variables de entorno al importar
import { getItem, setItem, removeItem } from './storage';

/**
 * Cliente API para suntus-app
 * Maneja autenticación y peticiones al backend
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

const TOKEN_KEY = 'suntus_access_token';

/**
 * Obtiene el token de acceso almacenado
 * Usa SecureStore en móvil y localStorage en web
 * @returns Token JWT si existe, null si no hay token o hay error
 */
export async function getAccessToken(): Promise<string | null> {
  return await getItem(TOKEN_KEY);
}

/**
 * Guarda el token de acceso
 * Usa SecureStore en móvil y localStorage en web
 * @param token - Token JWT a almacenar
 * @throws Error si falla el almacenamiento
 */
export async function setAccessToken(token: string): Promise<void> {
  await setItem(TOKEN_KEY, token);
}

/**
 * Elimina el token de acceso
 * Usa SecureStore en móvil y localStorage en web
 * No lanza error si el token no existe
 */
export async function removeAccessToken(): Promise<void> {
  await removeItem(TOKEN_KEY);
}

/**
 * Realiza una petición autenticada al backend
 * Agrega automáticamente el token JWT si está disponible
 * @param endpoint - Ruta del endpoint (con o sin / inicial)
 * @param options - Opciones de fetch (method, body, headers, etc.)
 * @returns Respuesta parseada como JSON
 * @throws Error si la respuesta no es exitosa
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('[API] No access token found. User may need to login.');
  }

  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (__DEV__) {
    console.log(`[API] ${options.method || 'GET'} ${url}`, {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
    });
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    
    // Si es 401, el token puede ser inválido o no existe
    if (response.status === 401) {
      console.error('[API] Unauthorized - Token may be invalid or expired. User needs to login.');
      // Opcional: limpiar token inválido
      if (token) {
        await removeAccessToken();
      }
    }
    
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Cliente API con métodos HTTP comunes
 * Todos los métodos agregan automáticamente el token JWT
 */
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: any) => 
    apiRequest<T>(endpoint, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  put: <T>(endpoint: string, data?: any) => 
    apiRequest<T>(endpoint, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  patch: <T>(endpoint: string, data?: any) => 
    apiRequest<T>(endpoint, { 
      method: 'PATCH', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};

