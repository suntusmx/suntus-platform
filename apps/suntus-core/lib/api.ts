import './env.validation'; // Valida variables de entorno al importar

/**
 * Cliente API para suntus-core
 * Maneja peticiones autenticadas al backend (autenticación local de admin)
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * Obtiene el token de acceso desde localStorage
 * @returns Token JWT si existe, null si no hay token o está en servidor
 */
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Intentar desde localStorage
  return localStorage.getItem('suntus_admin_token');
}

/**
 * Guarda el token de acceso en localStorage
 * @param token - Token JWT a almacenar
 */
export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('suntus_admin_token', token);
}

/**
 * Elimina el token de acceso de localStorage
 * No lanza error si el token no existe
 */
export function removeAccessToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('suntus_admin_token');
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
  const token = getAccessToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
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
  post: <T>(endpoint: string, data?: unknown) => 
    apiRequest<T>(endpoint, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  put: <T>(endpoint: string, data?: unknown) => 
    apiRequest<T>(endpoint, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  patch: <T>(endpoint: string, data?: unknown) => 
    apiRequest<T>(endpoint, { 
      method: 'PATCH', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};

