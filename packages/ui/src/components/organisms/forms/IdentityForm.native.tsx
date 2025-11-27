import { View, Platform, TouchableOpacity } from 'react-native';
import { useState } from 'react';
// DateTimePicker se instalará después, por ahora comentado
// import DateTimePicker from '@react-native-community/datetimepicker';
import { FormField } from '../../molecules/FormField';
import { Input } from '../../atoms/Input.native';
import { Typography } from '../../atoms/Typography';
import { SuntusButton } from '../../SuntusButton.native';

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
 * Organismo IdentityForm - Formulario de identidad compartido
 * Usado en onboarding de usuarios y registro de expertos
 */
export function IdentityForm({ defaultValues, onSubmit, isLoading = false }: IdentityFormProps) {
  const [firstName, setFirstName] = useState(defaultValues?.firstName || '');
  const [lastName, setLastName] = useState(defaultValues?.lastName || '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(defaultValues?.dateOfBirth || null);
  const [gender, setGender] = useState<IdentityFormData['gender']>(defaultValues?.gender);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          autoCapitalize: "words",
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
          autoCapitalize: "words",
        }}
      />

      <FormField
        label="Fecha de Nacimiento"
        required
        error={errors.dateOfBirth}
        inputProps={{
          value: formatDate(dateOfBirth),
          onFocus: () => setShowDatePicker(true),
          placeholder: "Selecciona tu fecha de nacimiento",
          editable: false,
        }}
      />

      {/* DateTimePicker - Se implementará cuando se instale la dependencia */}
      {/* Por ahora usar input de texto temporal */}
      {showDatePicker && (
        <View className="mt-2">
          <Input
            value={dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : ''}
            onChangeText={(text) => {
              if (text) {
                const date = new Date(text);
                if (!isNaN(date.getTime())) {
                  setDateOfBirth(date);
                  if (errors.dateOfBirth) setErrors((prev) => ({ ...prev, dateOfBirth: undefined }));
                }
              } else {
                setDateOfBirth(null);
              }
            }}
            placeholder="YYYY-MM-DD"
            keyboardType="numeric"
          />
        </View>
      )}

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

