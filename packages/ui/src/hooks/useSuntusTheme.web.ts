'use client';

import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

/**
 * Hook useSuntusTheme - Envuelve useColorScheme de NativeWind (Web)
 * Fuerza dark mode al inicio, ignorando la preferencia del sistema
 */
export function useSuntusTheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

  // Forzar dark mode al inicio (ignorar preferencia del sistema y localStorage)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setColorScheme('dark');
      // Asegurar que el HTML tenga la clase dark
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

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
