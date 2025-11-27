'use client';

import { TextInput, type TextInputProps } from 'react-native';
import { forwardRef } from 'react';

export interface InputProps extends Omit<TextInputProps, 'className'> {
  className?: string;
}

/**
 * Átomo Input - Componente de entrada de texto estilizado (Web)
 * Maneja correctamente el foco y colores en dark mode
 */
export const Input = forwardRef<TextInput, InputProps>(
  ({ className = '', ...props }, ref) => {
    // Clases base con estados de foco
    const baseClasses = 'rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

    return (
      <TextInput
        ref={ref}
        className={`${baseClasses} ${className}`.trim()}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

