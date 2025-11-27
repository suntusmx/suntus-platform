import { cssInterop } from 'nativewind';
import * as LucideIcons from 'lucide-react-native';
import { forwardRef, useMemo } from 'react';

// Mapear todos los iconos de Lucide
const icons = LucideIcons as unknown as Record<string, React.ComponentType<any>>;

// Configurar cssInterop para todos los iconos de Lucide una sola vez
// Esto debe estar fuera del componente para evitar re-configuraciones
Object.keys(icons).forEach((iconName) => {
  const IconComponent = icons[iconName];
  if (IconComponent && typeof IconComponent === 'function') {
    try {
      cssInterop(IconComponent, {
        className: {
          target: 'style',
          nativeStyleToProp: {
            color: true,
            opacity: true,
          },
        },
      });
    } catch (e) {
      // Si ya está configurado, ignorar
    }
  }
});

export interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Átomo Icon - Wrapper para iconos de Lucide React Native
 * Permite usar iconos con clases de Tailwind para color y tamaño
 */
export const Icon = forwardRef<any, IconProps>(
  ({ name, size = 24, className = '', color, ...props }, ref) => {
    const LucideIcon = useMemo(() => icons[name], [name]);

    if (!LucideIcon) {
      console.warn(`Icon "${name}" not found in lucide-react-native`);
      return null;
    }

    // Si hay color explícito, usarlo; si no, usar className
    const iconProps = color
      ? { size, color, ...props }
      : { size, className: className || 'text-foreground', ...props };

    return <LucideIcon ref={ref} {...iconProps} />;
  }
);

Icon.displayName = 'Icon';
