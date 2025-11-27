import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FormField, Typography, SuntusButton } from '@suntus/ui';
import { Input } from '@suntus/ui';
import { useState } from 'react';
import { useOnboardingStore } from '../../stores/onboarding.store';

/**
 * Step 2: Biometría
 * Captura peso y estatura con validación de rangos lógicos
 */
export default function BiometricsStep() {
  const router = useRouter();
  const { biometrics, setBiometrics, nextStep, previousStep } = useOnboardingStore();
  const [weight, setWeight] = useState(biometrics.weight?.toString() || '');
  const [height, setHeight] = useState(biometrics.height?.toString() || '');
  const [errors, setErrors] = useState<{ weight?: string; height?: string }>({});

  const calculateBMI = (w: number, h: number): number => {
    const heightInMeters = h / 100;
    return w / (heightInMeters * heightInMeters);
  };

  const validate = (): boolean => {
    const newErrors: { weight?: string; height?: string } = {};

    if (weight) {
      const weightNum = parseFloat(weight);
      if (isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
        newErrors.weight = 'El peso debe estar entre 30kg y 300kg';
      }
    }

    if (height) {
      const heightNum = parseFloat(height);
      if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
        newErrors.height = 'La estatura debe estar entre 100cm y 250cm';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      setBiometrics({
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
      });
      nextStep();
      router.push('/(onboarding)/location');
    }
  };

  const weightNum = weight ? parseFloat(weight) : null;
  const heightNum = height ? parseFloat(height) : null;
  const bmi = weightNum && heightNum ? calculateBMI(weightNum, heightNum) : null;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-8">
        <FormField
          label="Peso (kg)"
          error={errors.weight}
          inputProps={{
            value: weight,
            onChangeText: (text) => {
              const numericText = text.replace(/[^0-9.]/g, '');
              setWeight(numericText);
              if (errors.weight) setErrors((prev) => ({ ...prev, weight: undefined }));
            },
            placeholder: "75",
            keyboardType: "decimal-pad",
          }}
        />

        <FormField
          label="Estatura (cm)"
          error={errors.height}
          inputProps={{
            value: height,
            onChangeText: (text) => {
              const numericText = text.replace(/[^0-9.]/g, '');
              setHeight(numericText);
              if (errors.height) setErrors((prev) => ({ ...prev, height: undefined }));
            },
            placeholder: "170",
            keyboardType: "decimal-pad",
          }}
        />

        {bmi && (
          <View className="mt-4 p-4 rounded-md bg-muted">
            <Typography variant="body" className="text-foreground">
              IMC: {bmi.toFixed(1)}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground mt-1">
              {bmi < 18.5
                ? 'Bajo peso'
                : bmi < 25
                ? 'Peso normal'
                : bmi < 30
                ? 'Sobrepeso'
                : 'Obesidad'}
            </Typography>
          </View>
        )}

        <View className="flex-row gap-4 mt-6">
          <SuntusButton variant="outline" onPress={() => { previousStep(); router.back(); }} className="flex-1">
            Atrás
          </SuntusButton>
          <SuntusButton variant="primary" onPress={handleContinue} className="flex-1">
            Continuar
          </SuntusButton>
        </View>
      </View>
    </ScrollView>
  );
}

