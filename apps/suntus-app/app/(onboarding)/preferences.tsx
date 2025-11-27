import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography, SuntusButton } from '@suntus/ui';
import { useOnboardingStore, ClientGoal, ClientBudget } from '../../stores/onboarding.store';
import { useState } from 'react';

/**
 * Step 4: Objetivos y Presupuesto
 * UI gamificada con tiles seleccionables y slider/chips
 */
export default function PreferencesStep() {
  const router = useRouter();
  const { preferences, setPreferences, nextStep, previousStep } = useOnboardingStore();
  const [goal, setGoal] = useState<ClientGoal | null>(preferences.goal);
  const [budget, setBudget] = useState<ClientBudget | null>(preferences.budget);

  const goals: { value: ClientGoal; label: string }[] = [
    { value: 'LOSE_FAT', label: 'Bajar grasa' },
    { value: 'BUILD_MUSCLE', label: 'Ganar músculo' },
    { value: 'MAINTENANCE', label: 'Mantenimiento' },
    { value: 'PERFORMANCE', label: 'Rendimiento' },
  ];

  const budgets: { value: ClientBudget; label: string }[] = [
    { value: 'LOW', label: 'Bajo' },
    { value: 'MEDIUM', label: 'Medio' },
    { value: 'HIGH', label: 'Alto' },
    { value: 'NO_BUDGET', label: 'Sin presupuesto' },
  ];

  const handleContinue = () => {
    if (goal && budget) {
      setPreferences({ goal, budget });
      nextStep();
      router.push('/(onboarding)/terms');
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-8">
        <Typography variant="h2" className="mb-6 text-foreground">
          ¿Cuál es tu objetivo?
        </Typography>

        <View className="gap-3 mb-8">
          {goals.map((g) => (
            <SuntusButton
              key={g.value}
              variant={goal === g.value ? 'primary' : 'outline'}
              onPress={() => setGoal(g.value)}
              className="h-20 justify-center items-center"
            >
              <Typography variant="body" className="text-foreground text-center">
                {g.label}
              </Typography>
            </SuntusButton>
          ))}
        </View>

        <Typography variant="h2" className="mb-6 text-foreground">
          ¿Cuál es tu presupuesto?
        </Typography>

        <View className="flex-row flex-wrap gap-3 mb-8">
          {budgets.map((b) => (
            <SuntusButton
              key={b.value}
              variant={budget === b.value ? 'primary' : 'outline'}
              onPress={() => setBudget(b.value)}
              className="flex-1 min-w-[45%]"
            >
              {b.label}
            </SuntusButton>
          ))}
        </View>

        <View className="flex-row gap-4 mt-6">
          <SuntusButton variant="outline" onPress={() => { previousStep(); router.back(); }} className="flex-1">
            Atrás
          </SuntusButton>
          <SuntusButton
            variant="primary"
            onPress={handleContinue}
            disabled={!goal || !budget}
            className="flex-1"
          >
            Continuar
          </SuntusButton>
        </View>
      </View>
    </ScrollView>
  );
}

