'use client';

import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

/**
 * Hook useSuntusTheme - Envuelve useColorScheme de NativeWind (Web)
 * En web, NativeWind maneja el dark mode a través de la clase 'dark' en document
 */
export function useSuntusTheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

  // Sincronizar con localStorage en web
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (stored && stored !== colorScheme) {
        setColorScheme(stored);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', colorScheme || 'light');
    }
  }, [colorScheme]);

  const isDark = colorScheme === 'dark';

  const toggleTheme = () => {
    toggleColorScheme();
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setColorScheme(theme);
  };

  return {
    theme: colorScheme,
    isDark,
    toggleTheme,
    setTheme,
  };
}
