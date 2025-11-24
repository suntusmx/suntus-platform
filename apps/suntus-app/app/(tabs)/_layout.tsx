import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Entrenamientos',
          tabBarLabel: 'Entrenamientos',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
        }}
      />
    </Tabs>
  );
}

