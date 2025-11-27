import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AddressForm, AddressFormData, SuntusButton } from '@suntus/ui';
import { useOnboardingStore } from '../../stores/onboarding.store';
import { api } from '../../lib/api';

/**
 * Step 3: Ubicación Inteligente
 * Búsqueda por código postal con autocompletado
 */
export default function LocationStep() {
  const router = useRouter();
  const { location, setLocation, nextStep, previousStep } = useOnboardingStore();

  const handlePostalCodeSearch = async (postalCode: string) => {
    try {
      const result = await api.get<{
        stateId: string;
        stateName: string;
        municipalityId: string;
        municipalityName: string;
        cityId?: string;
        cityName?: string;
        neighborhoods?: string[];
      }>(`/locations/postal-code/${postalCode}`);
      return result;
    } catch (error) {
      console.error('Error searching postal code:', error);
      return null;
    }
  };

  const handleSubmit = (data: AddressFormData) => {
    setLocation(data);
    nextStep();
    router.push('/(onboarding)/preferences');
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-8">
        <AddressForm
          defaultValues={location}
          onSubmit={handleSubmit}
          onPostalCodeSearch={handlePostalCodeSearch}
        />
        <View className="mt-4">
          <SuntusButton variant="outline" onPress={() => { previousStep(); router.back(); }}>
            Atrás
          </SuntusButton>
        </View>
      </View>
    </ScrollView>
  );
}

