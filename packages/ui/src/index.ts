// Configurar cssInterop para React Native (solo se ejecuta en móvil, no en web)
// Esto debe estar aquí, no en los componentes individuales
if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
  try {
    const { cssInterop } = require('nativewind');
    const { TouchableOpacity, Text, TextInput, Pressable } = require('react-native');
    cssInterop(TouchableOpacity, { className: 'style' });
    cssInterop(Text, { className: 'style' });
    cssInterop(TextInput, { className: 'style' });
    cssInterop(Pressable, { className: 'style' });
  } catch (e) {
    // Si nativewind no está disponible, no hacer nada
  }
}

// Exportar componentes legacy (mantener compatibilidad)
export { Button } from './components/Button';
export { SuntusButton } from './components/SuntusButton.web';
export { ThemeToggle } from './components/ThemeToggle.web';

// Exportar Átomos (Atomic Design)
export * from './components/atoms';

// Exportar Moléculas (Atomic Design)
export * from './components/molecules';

// Exportar Organismos (Atomic Design)
export * from './components/organisms/forms';

// Exportar hooks (se resuelve automáticamente a .native.ts o .web.ts según la plataforma)
export { useSuntusTheme } from './hooks/useSuntusTheme.web';

// Re-exportar tipos legacy
export type { ButtonProps } from './components/Button';
export type { SuntusButtonProps } from './components/SuntusButton.web';
export type { ThemeToggleProps } from './components/ThemeToggle.web';
