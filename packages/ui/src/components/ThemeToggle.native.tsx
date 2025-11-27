import { TouchableOpacity, View } from 'react-native';
import { useSuntusTheme } from '../hooks/useSuntusTheme.native';
import { Icon } from './atoms/Icon';
import { Typography } from './atoms/Typography';

export interface ThemeToggleProps {
  className?: string;
}

/**
 * Componente ThemeToggle para cambiar entre dark y light mode (React Native)
 * Usa useSuntusTheme que envuelve useColorScheme de NativeWind
 * Usa iconos de Lucide en lugar de emojis
 */
export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useSuntusTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`flex-row items-center justify-center gap-2 px-4 py-2 rounded-lg bg-card active:opacity-80 ${className}`}
      activeOpacity={0.8}
    >
      {isDark ? (
        <>
          <Icon name="Sun" size={20} className="text-foreground" />
          <Typography variant="body" className="text-foreground">
            Light
          </Typography>
        </>
      ) : (
        <>
          <Icon name="Moon" size={20} className="text-foreground" />
          <Typography variant="body" className="text-foreground">
            Dark
          </Typography>
        </>
      )}
    </TouchableOpacity>
  );
}
