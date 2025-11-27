'use client';

import { View } from 'react-native';
import { useState } from 'react';
import { FormField } from '../../molecules/FormField';
import { Input } from '../../atoms/Input.web';
import { Typography } from '../../atoms/Typography';
import { SuntusButton } from '../../SuntusButton.web';

export interface IdentityFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface IdentityFormProps {
  defaultValues?: Partial<IdentityFormData>;
  onSubmit: (data: IdentityFormData) => void;
  isLoading?: boolean;
}

/**
 * Organismo IdentityForm - Formulario de identidad compartido (Web)
 * Usado en onboarding de usuarios y registro de expertos
 */
export function IdentityForm({ defaultValues, onSubmit, isLoading = false }: IdentityFormProps) {
  const [firstName, setFirstName] = useState(defaultValues?.firstName || '');
  const [lastName, setLastName] = useState(defaultValues?.lastName || '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(defaultValues?.dateOfBirth || null);
  const [gender, setGender] = useState<IdentityFormData['gender']>(defaultValues?.gender);
  const [errors, setErrors] = useState<Partial<Record<keyof IdentityFormData, string>>>({});

  const calculateAge = (date: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD para input type="date"
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof IdentityFormData, string>> = {};

    if (!firstName.trim() || firstName.length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!lastName.trim() || lastName.length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'La fecha de nacimiento es requerida';
    } else {
      const age = calculateAge(dateOfBirth);
      if (age < 13) {
        newErrors.dateOfBirth = 'Debes tener al menos 13 años';
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Fecha de nacimiento no válida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
        gender,
      });
    }
  };

  return (
    <View className="flex-1">
      <FormField
        label="Nombre"
        required
        error={errors.firstName}
        inputProps={{
          value: firstName,
          onChangeText: (text) => {
            setFirstName(text);
            if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
          },
          placeholder: "Tu nombre",
        }}
      />

      <FormField
        label="Apellido"
        required
        error={errors.lastName}
        inputProps={{
          value: lastName,
          onChangeText: (text) => {
            setLastName(text);
            if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
          },
          placeholder: "Tu apellido",
        }}
      />

      <FormField
        label="Fecha de Nacimiento"
        required
        error={errors.dateOfBirth}
        inputProps={{
          type: 'date',
          value: formatDate(dateOfBirth),
          onChange: (e: any) => {
            const date = e.target.value ? new Date(e.target.value) : null;
            setDateOfBirth(date);
            if (errors.dateOfBirth) setErrors((prev) => ({ ...prev, dateOfBirth: undefined }));
          },
          max: new Date().toISOString().split('T')[0],
          min: new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split('T')[0],
        } as any}
      />

      {dateOfBirth && (
        <Typography variant="caption" className="mt-1 text-muted-foreground">
          Edad: {calculateAge(dateOfBirth)} años
        </Typography>
      )}

      <View className="mt-4">
        <Typography variant="body" className="mb-2 text-foreground">
          Género (Opcional)
        </Typography>
        <View className="flex-row gap-2">
          {(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => (
            <SuntusButton
              key={g}
              variant={gender === g ? 'primary' : 'outline'}
              onPress={() => setGender(g)}
              className="flex-1"
              title={g === 'MALE' ? 'Masculino' : g === 'FEMALE' ? 'Femenino' : 'Otro'}
            />
          ))}
        </View>
      </View>

      <SuntusButton
        variant="primary"
        onPress={handleSubmit}
        disabled={isLoading}
        className="mt-6"
        title={isLoading ? 'Guardando...' : 'Continuar'}
      />
    </View>
  );
}

