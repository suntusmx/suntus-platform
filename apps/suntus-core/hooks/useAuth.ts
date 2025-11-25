'use client';

import { useState, useEffect, useCallback } from 'react';
import { login, logout, getCurrentUser, checkAuth, AdminUser, LoginCredentials } from '../lib/auth';

export interface UseAuthReturn {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook para manejar autenticación local en suntus-core
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión al montar
  useEffect(() => {
    checkAuth()
      .then((adminUser) => {
        setUser(adminUser);
      })
      .catch((error) => {
        console.error('Auth check error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const adminUser = await login(credentials);
      setUser(adminUser);
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
      const adminUser = await getCurrentUser();
      setUser(adminUser);
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

