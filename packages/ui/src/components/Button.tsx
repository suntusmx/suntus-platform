import { Text, TouchableOpacity } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

/**
 * Componente Button compartido usando NativeWind
 * Funciona en React Native y Next.js (con compatibilidad)
 */
export function Button({ title, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const baseClasses = 'px-4 py-3 rounded-lg font-semibold items-center justify-center';
  const variantClasses = variant === 'primary' 
    ? 'bg-primary-500 active:bg-primary-600' 
    : 'bg-gray-200 active:bg-gray-300';
  const disabledClasses = disabled ? 'opacity-50' : '';
  const textColorClasses = variant === 'primary' ? 'text-white' : 'text-gray-900';

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text className={`text-base font-semibold ${textColorClasses}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

