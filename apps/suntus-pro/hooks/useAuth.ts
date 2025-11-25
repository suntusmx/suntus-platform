import { useState, useEffect, useCallback } from 'react';
import { login, logout, getCurrentUser, checkAuth, AuthUser } from '../lib/auth';

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook para manejar autenticación en suntus-pro
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión al montar
  useEffect(() => {
    checkAuth()
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        console.error('Auth check error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      const authUser = await login();
      setUser(authUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const authUser = await getCurrentUser();
      setUser(authUser);
    } catch (error) {
      console.error('Refresh error:', error);
      setUser(null);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    refresh,
  };
}

