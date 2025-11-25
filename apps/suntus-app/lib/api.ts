import * as SecureStore from 'expo-secure-store';

/**
 * Cliente API para suntus-app
 * Maneja autenticación y peticiones al backend
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

const TOKEN_KEY = 'suntus_access_token';

/**
 * Obtiene el token de acceso almacenado desde SecureStore
 * @returns Token JWT si existe, null si no hay token o hay error
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Guarda el token de acceso en SecureStore
 * @param token - Token JWT a almacenar
 * @throws Error si falla el almacenamiento
 */
export async function setAccessToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting access token:', error);
    throw error;
  }
}

/**
 * Elimina el token de acceso de SecureStore
 * No lanza error si el token no existe
 */
export async function removeAccessToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing access token:', error);
  }
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
  }

  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
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

