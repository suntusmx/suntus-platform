// Configurar cssInterop para React Native (solo se ejecuta en móvil, no en web)
// Esto debe estar aquí, no en los componentes individuales
if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
  try {
    const { cssInterop } = require('nativewind');
    const { TouchableOpacity, Text } = require('react-native');
    cssInterop(TouchableOpacity, { className: 'style' });
    cssInterop(Text, { className: 'style' });
  } catch (e) {
    // Si nativewind no está disponible, no hacer nada
  }
}

// Exportar componentes
export { Button } from './components/Button';
export { SuntusButton } from './components/SuntusButton';
export { ThemeToggle } from './components/ThemeToggle';

// Exportar hooks
export { useSuntusTheme } from './hooks/useSuntusTheme';

// Re-exportar tipos
export type { ButtonProps } from './components/Button';
export type { SuntusButtonProps } from './components/SuntusButton.web';
export type { ThemeToggleProps } from './components/ThemeToggle.web';
