import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

/**
 * Hook useSuntusTheme - Envuelve useColorScheme de NativeWind (React Native)
 * Fuerza dark mode al inicio, ignorando la preferencia del sistema
 */
export function useSuntusTheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

  // Forzar dark mode al inicio (ignorar preferencia del sistema)
  useEffect(() => {
    setColorScheme('dark');
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
