import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { cssInterop } from 'nativewind';

// Configurar cssInterop para TouchableOpacity y Text (requerido en NativeWind v4)
cssInterop(TouchableOpacity, { className: 'style' });
cssInterop(Text, { className: 'style' });

export interface SuntusButtonProps extends Omit<TouchableOpacityProps, 'className'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Componente SuntusButton compartido usando NativeWind v4
 * Funciona en React Native y Next.js (con react-native-web)
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
  
  // Variantes de color
  const variantClasses = {
    primary: 'bg-blue-500 active:bg-blue-600',
    secondary: 'bg-gray-200 active:bg-gray-300',
    outline: 'border-2 border-blue-500 bg-transparent active:bg-blue-50',
  };
  
  // Tamaños
  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };
  
  // Estados
  const disabledClasses = disabled ? 'opacity-50' : '';
  
  // Colores de texto
  const textColorClasses = {
    primary: 'text-white',
    secondary: 'text-gray-900',
    outline: 'text-blue-500',
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

