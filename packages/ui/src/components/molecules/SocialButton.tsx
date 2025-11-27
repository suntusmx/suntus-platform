import { View } from 'react-native';
import { ButtonBase } from '../atoms/ButtonBase';
import { Typography } from '../atoms/Typography';
import { Icon } from '../atoms/Icon';

export interface SocialButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  className?: string;
}

/**
 * Molécula SocialButton - Botón específico para Login Social
 * Icono + Texto centrado con fondo específico
 */
export function SocialButton({ provider, onPress, className = '' }: SocialButtonProps) {
  const providerConfig = {
    google: {
      icon: 'Chrome' as const, // Icono de Chrome para Google
      text: 'Continuar con Google',
      bgClass: 'bg-white dark:bg-gray-800',
      textClass: 'text-gray-900 dark:text-gray-100',
      borderClass: 'border border-border',
    },
    apple: {
      icon: 'Apple' as const, // Icono de Apple
      text: 'Continuar con Apple',
      bgClass: 'bg-black dark:bg-white',
      textClass: 'text-white dark:text-black',
      borderClass: '',
    },
  };

  const config = providerConfig[provider];

  return (
    <ButtonBase
      variant="solid"
      size="md"
      onPress={onPress}
      className={`${config.bgClass} ${config.borderClass} ${className}`.trim()}
    >
      <View className="flex-row items-center justify-center gap-2">
        <Icon name={config.icon} size={20} className={config.textClass} />
        <Typography variant="body" className={config.textClass}>
          {config.text}
        </Typography>
      </View>
    </ButtonBase>
  );
}

