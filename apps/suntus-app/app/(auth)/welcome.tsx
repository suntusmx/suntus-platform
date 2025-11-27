import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography, SuntusButton } from '@suntus/ui';
import { useAuth } from '../../hooks/useAuth';

/**
 * Pantalla de Bienvenida
 * Punto de entrada para usuarios nuevos y recurrentes
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Si ya está autenticado, ir a onboarding
      router.push('/(onboarding)/identity');
    } else {
      // Si no está autenticado, ir a registro
      router.push('/(auth)/register');
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6 py-12 min-h-screen">
        {/* Logo o animación Lottie aquí */}
        <View className="mb-8">
          <Typography variant="h1" className="text-primary text-center mb-4">
            ¡Bienvenido a suntUS!
          </Typography>
          <Typography variant="body" className="text-muted-foreground text-center">
            Tu plataforma de fitness y nutrición personalizada
          </Typography>
        </View>

        <View className="w-full max-w-sm gap-4 mt-8">
          <SuntusButton 
            variant="primary" 
            onPress={handleGetStarted} 
            className="w-full"
            title="Comenzar"
          />

          {!isAuthenticated && (
            <SuntusButton 
              variant="outline" 
              onPress={handleLogin} 
              className="w-full"
              title="Iniciar Sesión"
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

