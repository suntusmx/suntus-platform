import { TextInput, type TextInputProps } from 'react-native';
import { forwardRef } from 'react';

export interface InputProps extends Omit<TextInputProps, 'className'> {
  className?: string;
}

/**
 * Átomo Input - Componente de entrada de texto estilizado (React Native)
 * Maneja correctamente el padding, bordes y colores en dark mode
 */
export const Input = forwardRef<TextInput, InputProps>(
  ({ className = '', placeholderTextColor, ...props }, ref) => {
    // Clases base
    const baseClasses = 'rounded-md border border-border bg-background px-4 py-3 text-foreground';
    
    // Color del placeholder según el tema (se detecta automáticamente con NativeWind)
    const defaultPlaceholderColor = Platform.select({
      ios: '#9CA3AF', // gray-400
      android: '#9CA3AF',
      default: '#9CA3AF',
    });

    return (
      <TextInput
        ref={ref}
        className={`${baseClasses} ${className}`.trim()}
        placeholderTextColor={placeholderTextColor || defaultPlaceholderColor}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

