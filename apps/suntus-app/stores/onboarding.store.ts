import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ClientGoal = 'LOSE_FAT' | 'BUILD_MUSCLE' | 'MAINTENANCE' | 'PERFORMANCE';
export type ClientBudget = 'LOW' | 'MEDIUM' | 'HIGH' | 'NO_BUDGET';
export type ClientGender = 'MALE' | 'FEMALE' | 'OTHER';

interface IdentityData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  gender?: ClientGender;
}

interface BiometricsData {
  weight: number | null;
  height: number | null;
}

interface LocationData {
  postalCode: string;
  stateId: string | null;
  municipalityId: string | null;
  cityId: string | null;
  neighborhood: string | null;
}

interface PreferencesData {
  goal: ClientGoal | null;
  budget: ClientBudget | null;
}

interface OnboardingState {
  // Slices de datos
  identity: IdentityData;
  biometrics: BiometricsData;
  location: LocationData;
  preferences: PreferencesData;

  // Estado del wizard
  currentStep: number;
  isSubmitting: boolean;

  // Acciones
  setIdentity: (data: Partial<IdentityData>) => void;
  setBiometrics: (data: Partial<BiometricsData>) => void;
  setLocation: (data: Partial<LocationData>) => void;
  setPreferences: (data: Partial<PreferencesData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
}

const initialState = {
  identity: {
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    gender: undefined,
  },
  biometrics: {
    weight: null,
    height: null,
  },
  location: {
    postalCode: '',
    stateId: null,
    municipalityId: null,
    cityId: null,
    neighborhood: null,
  },
  preferences: {
    goal: null,
    budget: null,
  },
  currentStep: 0,
  isSubmitting: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,

      setIdentity: (data) =>
        set((state) => ({
          identity: { ...state.identity, ...data },
        })),

      setBiometrics: (data) =>
        set((state) => ({
          biometrics: { ...state.biometrics, ...data },
        })),

      setLocation: (data) =>
        set((state) => ({
          location: { ...state.location, ...data },
        })),

      setPreferences: (data) =>
        set((state) => ({
          preferences: { ...state.preferences, ...data },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 4), // Máximo 5 pasos (0-4)
        })),

      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      setCurrentStep: (step) =>
        set(() => ({
          currentStep: step,
        })),

      reset: () => set(initialState),

      setSubmitting: (isSubmitting) =>
        set(() => ({
          isSubmitting,
        })),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir datos, no estado de UI
      partialize: (state) => ({
        identity: state.identity,
        biometrics: state.biometrics,
        location: state.location,
        preferences: state.preferences,
        currentStep: state.currentStep,
      }),
    }
  )
);

