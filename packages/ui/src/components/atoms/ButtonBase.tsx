import { Pressable, type PressableProps } from 'react-native';
import { forwardRef } from 'react';

export interface ButtonBaseProps extends Omit<PressableProps, 'className'> {
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

/**
 * Átomo ButtonBase - Componente base de botón con estados visuales
 * Usa colores semánticos y maneja estados (active, disabled)
 */
export const ButtonBase = forwardRef<React.ElementRef<typeof Pressable>, ButtonBaseProps>(
  ({ variant = 'solid', size = 'md', className = '', disabled, children, ...props }, ref) => {
    // Clases base
    const baseClasses = 'rounded-md items-center justify-center';
    
    // Variantes de estilo
    const variantClasses = {
      solid: 'bg-primary active:opacity-90',
      outline: 'border-2 border-primary bg-transparent active:bg-primary/10',
      ghost: 'bg-transparent active:bg-primary/10',
      link: 'bg-transparent',
    };
    
    // Tamaños
    const sizeClasses = {
      sm: 'px-3 py-1.5',
      md: 'px-4 py-2.5',
      lg: 'px-6 py-3.5',
    };
    
    // Estados
    const disabledClasses = disabled ? 'opacity-50' : '';
    
    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`.trim();

    return (
      <Pressable
        ref={ref}
        className={buttonClasses}
        disabled={disabled}
        {...props}
      >
        {children}
      </Pressable>
    );
  }
);

ButtonBase.displayName = 'ButtonBase';

