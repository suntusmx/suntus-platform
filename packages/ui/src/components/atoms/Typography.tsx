import { Text, type TextProps } from 'react-native';
import { forwardRef } from 'react';

export interface TypographyProps extends Omit<TextProps, 'className'> {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'link';
  color?: string;
  className?: string;
}

/**
 * Átomo Typography - Componente de texto estilizado
 * Centraliza todos los estilos de texto para facilitar cambios globales
 */
export const Typography = forwardRef<Text, TypographyProps>(
  ({ variant = 'body', color, className = '', children, ...props }, ref) => {
    // Variantes de tamaño y peso
    const variantClasses = {
      h1: 'text-4xl font-bold',
      h2: 'text-3xl font-bold',
      h3: 'text-2xl font-semibold',
      body: 'text-base font-normal',
      caption: 'text-sm font-normal',
      link: 'text-base font-medium underline',
    };

    // Color por defecto o el especificado
    const colorClass = color || 'text-foreground';

    const classes = `${variantClasses[variant]} ${colorClass} ${className}`.trim();

    return (
      <Text ref={ref} className={classes} {...props}>
        {children}
      </Text>
    );
  }
);

Typography.displayName = 'Typography';

