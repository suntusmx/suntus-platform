import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useSuntusTheme } from '@suntus/ui';
import { useEffect } from 'react';
import '../lib/i18n'; // Inicializar i18n
import { useAuth } from '../hooks/useAuth';
import { useClientProfile } from '../hooks/useClientProfile';

/**
 * Auth Guard - El Limbo
 * Verifica si el usuario tiene sesión pero NO tiene ClientProfile
 * Si es así, redirige a onboarding
 */
function AuthGuard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useClientProfile();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Esperar a que termine la carga de auth
    if (authLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    // Si no está autenticado, puede estar en auth o onboarding
    if (!isAuthenticated) {
      if (!inAuthGroup && !inOnboardingGroup) {
        router.replace('/(auth)/welcome');
      }
      return;
    }

    // Si está autenticado, esperar a que termine la carga del profile
    if (profileLoading) return;

    // Si está autenticado pero es CLIENT y NO tiene perfil
    if (user?.role === 'CLIENT' && !profile) {
      // Si no está en onboarding, redirigir
      if (!inOnboardingGroup) {
        router.replace('/(onboarding)/identity');
      }
      return;
    }

    // Si tiene perfil o es EXPERT, puede acceder a tabs
    if (profile || user?.role === 'EXPERT') {
      if (inAuthGroup || inOnboardingGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, user, profile, authLoading, profileLoading, segments, router]);

  return null;
}

export default function RootLayout() {
  // Forzar dark mode al inicio
  const { setTheme } = useSuntusTheme();
  
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return (
    <ErrorBoundary>
      <AuthGuard />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      </Stack>
    </ErrorBoundary>
  );
}

