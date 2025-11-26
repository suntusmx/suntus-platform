import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SuntusButton, ThemeToggle, useSuntusTheme } from '@suntus/ui';

export default function HomeScreen() {
  const { isDark } = useSuntusTheme();

  return (
    <View className="flex-1 bg-background items-center justify-center p-5">
      {/* Toggle de tema en la esquina superior */}
      <View className="absolute top-12 right-5 z-10">
        <ThemeToggle />
      </View>

      <Text className="text-2xl font-bold mb-2 text-foreground">Bienvenido a suntUS</Text>
      <Text className="text-base text-foreground/70 mb-8">Tu plataforma de fitness</Text>
      
      {/* Test: SuntusButton compartido desde @suntus/ui - Debe verse verde menta (#18CB96) */}
      <View className="gap-4 w-full max-w-xs">
        <SuntusButton
          title="Botón Primary (Verde Menta)"
          onPress={() => console.log('SuntusButton Primary funciona!')}
          variant="primary"
        />
        <SuntusButton
          title="Botón Secondary"
          onPress={() => console.log('SuntusButton Secondary funciona!')}
          variant="secondary"
        />
        <SuntusButton
          title="Botón Outline"
          onPress={() => console.log('SuntusButton Outline funciona!')}
          variant="outline"
        />
      </View>
      
      <StatusBar style={isDark ? "light" : "auto"} />
    </View>
  );
}
