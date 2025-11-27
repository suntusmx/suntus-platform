import '../global.css'; // Importar estilos globales (ruta relativa a prueba de balas)
import { Stack } from 'expo-router';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useSuntusTheme } from '@suntus/ui';
import { useEffect } from 'react';
import '../lib/i18n'; // Inicializar i18n

export default function RootLayout() {
  // Forzar dark mode al inicio
  const { setTheme } = useSuntusTheme();
  
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return (
    <ErrorBoundary>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ErrorBoundary>
  );
}

