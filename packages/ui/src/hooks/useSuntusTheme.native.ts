import { useColorScheme } from 'nativewind';

/**
 * Hook useSuntusTheme - Envuelve useColorScheme de NativeWind (React Native)
 * NativeWind maneja el estado del tema automáticamente
 */
export function useSuntusTheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

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

