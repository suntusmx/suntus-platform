import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { IdentityForm, IdentityFormData } from '@suntus/ui';
import { useOnboardingStore } from '../../stores/onboarding.store';

/**
 * Step 1: Identidad
 * Captura nombre, apellido, fecha de nacimiento y género
 */
export default function IdentityStep() {
  const router = useRouter();
  const { identity, setIdentity, nextStep } = useOnboardingStore();

  const handleSubmit = (data: IdentityFormData) => {
    setIdentity(data);
    nextStep();
    router.push('/(onboarding)/biometrics');
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-8">
        <IdentityForm defaultValues={identity} onSubmit={handleSubmit} />
      </View>
    </ScrollView>
  );
}

