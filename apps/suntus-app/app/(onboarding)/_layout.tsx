import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="identity" options={{ title: 'Identidad', headerShown: false }} />
      <Stack.Screen name="biometrics" options={{ title: 'Biometría', headerShown: false }} />
      <Stack.Screen name="location" options={{ title: 'Ubicación', headerShown: false }} />
      <Stack.Screen name="preferences" options={{ title: 'Objetivos', headerShown: false }} />
      <Stack.Screen name="terms" options={{ title: 'Términos', headerShown: false }} />
      <Stack.Screen name="loading" options={{ title: 'Cargando', headerShown: false }} />
    </Stack>
  );
}

