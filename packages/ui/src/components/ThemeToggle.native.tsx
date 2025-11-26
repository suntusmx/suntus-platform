import { Text, TouchableOpacity } from 'react-native';
import { useSuntusTheme } from '../hooks/useSuntusTheme';

export interface ThemeToggleProps {
  className?: string;
}

/**
 * Componente ThemeToggle para cambiar entre dark y light mode (React Native)
 * Usa useSuntusTheme que envuelve useColorScheme de NativeWind
 */
export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useSuntusTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`flex-row items-center justify-center px-4 py-2 rounded-lg bg-card dark:bg-card active:opacity-80 ${className}`}
      activeOpacity={0.8}
    >
      <Text className="text-base font-semibold text-foreground">
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </Text>
    </TouchableOpacity>
  );
}
