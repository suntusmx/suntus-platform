import { View, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography, SuntusButton } from '@suntus/ui';
import { useOnboardingStore } from '../../stores/onboarding.store';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

/**
 * Step 5: Términos y Condiciones
 * Checkbox obligatorio y visualización de T&C
 */
export default function TermsStep() {
  const router = useRouter();
  const { previousStep, setSubmitting, reset } = useOnboardingStore();
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [terms, setTerms] = useState<{ id: string; title: string; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const data = await api.get<{ id: string; version: string; title: any; content: any }>('/terms/current');
        // Extraer texto traducido del JSONB
        const titleText = typeof data.title === 'object' ? data.title.es || data.title.en || '' : String(data.title || '');
        const contentText = typeof data.content === 'object' ? data.content.es || data.content.en || '' : String(data.content || '');
        setTerms({ id: data.id, title: titleText, content: contentText });
      } catch (error) {
        console.error('Error fetching terms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const handleSubmit = async () => {
    if (!accepted || !terms) return;

    try {
      setSubmitting(true);
      // Obtener todos los datos del store
      const { identity, biometrics, location, preferences } = useOnboardingStore.getState();

      // Preparar datos para enviar
      const profileData = {
        firstName: identity.firstName,
        lastName: identity.lastName,
        dateOfBirth: identity.dateOfBirth?.toISOString(),
        initialWeight: biometrics.weight,
        height: biometrics.height,
        postalCode: location.postalCode,
        stateId: location.stateId,
        municipalityId: location.municipalityId,
        cityId: location.cityId,
        neighborhood: location.neighborhood,
        goal: preferences.goal,
        budget: preferences.budget,
        gender: identity.gender,
      };

      // Crear perfil
      await api.post('/client-profile', profileData);

      // Aceptar términos
      await api.post('/terms/accept', { termsId: terms.title }); // Ajustar según estructura real

      // Resetear store
      reset();

      // Ir a pantalla de loading
      router.replace('/(onboarding)/loading');
    } catch (error: any) {
      console.error('Error creating profile:', error);
      // Manejar error (mostrar mensaje amigable)
      Alert.alert(
        'Oops',
        error.message || 'Algo salió mal. Intenta de nuevo.',
        [{ text: 'OK' }]
      );
      setSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-8">
        <Typography variant="h2" className="mb-6 text-foreground">
          Términos y Condiciones
        </Typography>

        {isLoading ? (
          <Typography variant="body" className="text-muted-foreground">
            Cargando términos...
          </Typography>
        ) : (
          <>
            <SuntusButton variant="outline" onPress={() => setShowTerms(true)} className="mb-6">
              Leer Términos y Condiciones
            </SuntusButton>

            <TouchableOpacity
              onPress={() => setAccepted(!accepted)}
              className="flex-row items-center gap-3 mb-8"
            >
              <View className={`w-6 h-6 rounded border-2 items-center justify-center ${
                accepted ? 'bg-primary border-primary' : 'border-border'
              }`}>
                {accepted && <Typography variant="body" className="text-white">✓</Typography>}
              </View>
              <Typography variant="body" className="text-foreground flex-1">
                Acepto los Términos y Condiciones
              </Typography>
            </TouchableOpacity>

            <View className="flex-row gap-4 mt-6">
              <SuntusButton variant="outline" onPress={() => { previousStep(); router.back(); }} className="flex-1">
                Atrás
              </SuntusButton>
              <SuntusButton
                variant="primary"
                onPress={handleSubmit}
                disabled={!accepted}
                className="flex-1"
              >
                Finalizar
              </SuntusButton>
            </View>
          </>
        )}

        <Modal visible={showTerms} animationType="slide" onRequestClose={() => setShowTerms(false)}>
          <View className="flex-1 bg-background p-6">
            <Typography variant="h2" className="mb-4 text-foreground">
              {terms?.title || 'Términos y Condiciones'}
            </Typography>
            <ScrollView>
              <Typography variant="body" className="text-foreground">
                {terms?.content || 'Cargando contenido...'}
              </Typography>
            </ScrollView>
            <SuntusButton variant="primary" onPress={() => setShowTerms(false)} className="mt-6">
              Cerrar
            </SuntusButton>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

