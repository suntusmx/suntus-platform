import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@suntus/ui';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard de Experto</Text>
      <Text style={styles.subtitle}>Gestiona tus clientes y planes</Text>
      
      {/* Smoke Test: Button compartido desde @suntus/ui */}
      <Button 
        title="Test Button desde @suntus/ui" 
        onPress={() => console.log('Button funciona!')} 
      />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

