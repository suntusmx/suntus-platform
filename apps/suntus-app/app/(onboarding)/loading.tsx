import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Typography } from '@suntus/ui';
// import LottieView from 'lottie-react-native'; // Instalar si es necesario

/**
 * Magic Loader - Pantalla de transición con mensajes rotativos
 * Feedback psicológico durante el procesamiento
 */
const messages = [
  'Calibrando macros...',
  'Buscando entrenador perfecto...',
  'Configurando tu perfil...',
  '¡Casi listo! Preparando tu experiencia...',
];

export default function OnboardingLoader() {
  const router = useRouter();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Rotar mensajes cada 2 segundos
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    // Simular procesamiento (3-4 segundos)
    const timeout = setTimeout(() => {
      router.replace('/(tabs)');
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      {/* Lottie animation aquí */}
      <View className="mb-8">
        {/* <LottieView source={require('../../assets/loading.json')} autoPlay loop /> */}
        <View className="w-32 h-32 rounded-full bg-primary/20 items-center justify-center">
          <Typography variant="h1" className="text-primary">
            suntUS
          </Typography>
        </View>
      </View>

      <Typography variant="h3" className="text-foreground text-center mb-2">
        {messages[currentMessageIndex]}
      </Typography>

      <Typography variant="caption" className="text-muted-foreground text-center">
        Esto solo tomará un momento...
      </Typography>
    </View>
  );
}

