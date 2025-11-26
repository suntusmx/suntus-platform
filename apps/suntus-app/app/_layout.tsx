import '../global.css';
import { Stack } from 'expo-router';
import { ErrorBoundary } from '../components/ErrorBoundary';
import '../lib/i18n'; // Inicializar i18n

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ErrorBoundary>
  );
}

