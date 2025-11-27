import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SuntusButton } from '@suntus/ui';

export default function DashboardScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center p-5">
      <Text className="text-2xl font-bold mb-2 text-foreground">Dashboard de Experto</Text>
      <Text className="text-base text-foreground/70 mb-8">Gestiona tus clientes y planes</Text>

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

      <StatusBar style="light" />
    </View>
  );
}
