import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@suntus/ui';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-5">
      <Text className="text-2xl font-bold mb-2">Bienvenido a suntUS</Text>
      <Text className="text-base text-gray-600 mb-8">Tu plataforma de fitness</Text>
      
      {/* Smoke Test: Button compartido desde @suntus/ui */}
      <Button 
        title="Test Button desde @suntus/ui" 
        onPress={() => console.log('Button funciona!')} 
      />
      
      <StatusBar style="auto" />
    </View>
  );
}


