import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

export interface SuntusButtonProps extends Omit<TouchableOpacityProps, 'className'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Componente SuntusButton compartido usando NativeWind v4 (React Native)
 * cssInterop se configura en packages/ui/src/index.ts
 */
export function SuntusButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}: SuntusButtonProps) {
  // Clases base
  const baseClasses = 'rounded-lg font-semibold items-center justify-center';
  
  // Variantes de color - Usando variables semánticas
  const variantClasses = {
    primary: 'bg-primary active:opacity-90',
    secondary: 'bg-card dark:bg-card active:opacity-90',
    outline: 'border-2 border-primary bg-transparent active:bg-primary/10',
  };
  
  // Tamaños
  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };
  
  // Estados
  const disabledClasses = disabled ? 'opacity-50' : '';
  
  // Colores de texto - Usando variables semánticas
  const textColorClasses = {
    primary: 'text-primary-foreground',
    secondary: 'text-card-foreground',
    outline: 'text-primary',
  };
  
  // Tamaños de texto
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`.trim();
  const textClasses = `${textColorClasses[variant]} ${textSizeClasses[size]} font-semibold`.trim();

  return (
    <TouchableOpacity
      className={buttonClasses}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      <Text className={textClasses}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
