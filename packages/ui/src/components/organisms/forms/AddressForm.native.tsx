import { View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { FormField } from '../../molecules/FormField';
import { Input } from '../../atoms/Input.native';
import { Typography } from '../../atoms/Typography';
import { SuntusButton } from '../../SuntusButton.native';

export interface AddressFormData {
  postalCode: string;
  stateId: string | null;
  municipalityId: string | null;
  cityId: string | null;
  neighborhood: string | null;
}

export interface LocationOption {
  id: string;
  name: string;
}

export interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  onPostalCodeSearch?: (postalCode: string) => Promise<{
    stateId: string;
    stateName: string;
    municipalityId: string;
    municipalityName: string;
    cityId?: string;
    cityName?: string;
    neighborhoods?: string[];
  } | null>;
  onStateChange?: (stateId: string) => Promise<LocationOption[]>;
  onMunicipalityChange?: (municipalityId: string) => Promise<LocationOption[]>;
  isLoading?: boolean;
}

/**
 * Organismo AddressForm - Formulario de ubicación inteligente compartido
 * Maneja la lógica de búsqueda por código postal y autocompletado
 */
export function AddressForm({
  defaultValues,
  onSubmit,
  onPostalCodeSearch,
  onStateChange,
  onMunicipalityChange,
  isLoading = false,
}: AddressFormProps) {
  const [postalCode, setPostalCode] = useState(defaultValues?.postalCode || '');
  const [stateId, setStateId] = useState<string | null>(defaultValues?.stateId || null);
  const [municipalityId, setMunicipalityId] = useState<string | null>(defaultValues?.municipalityId || null);
  const [cityId, setCityId] = useState<string | null>(defaultValues?.cityId || null);
  const [neighborhood, setNeighborhood] = useState<string | null>(defaultValues?.neighborhood || null);
  
  const [stateName, setStateName] = useState('');
  const [municipalityName, setMunicipalityName] = useState('');
  const [cityName, setCityName] = useState('');
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});

  // Debounce para búsqueda de código postal
  useEffect(() => {
    if (postalCode.length === 5 && /^\d+$/.test(postalCode) && onPostalCodeSearch) {
      const timeoutId = setTimeout(async () => {
        setIsSearching(true);
        try {
          const result = await onPostalCodeSearch(postalCode);
          if (result) {
            setStateId(result.stateId);
            setStateName(result.stateName);
            setMunicipalityId(result.municipalityId);
            setMunicipalityName(result.municipalityName);
            if (result.cityId) {
              setCityId(result.cityId);
              setCityName(result.cityName || '');
            }
            if (result.neighborhoods && result.neighborhoods.length > 0) {
              setNeighborhoods(result.neighborhoods);
              if (result.neighborhoods.length === 1) {
                setNeighborhood(result.neighborhoods[0]);
              }
            } else {
              setNeighborhoods([]);
              setNeighborhood(null);
            }
            setErrors((prev) => ({ ...prev, postalCode: undefined }));
          } else {
            setErrors((prev) => ({ ...prev, postalCode: 'Código postal no encontrado' }));
          }
        } catch (error) {
          setErrors((prev) => ({ ...prev, postalCode: 'Error al buscar código postal' }));
        } finally {
          setIsSearching(false);
        }
      }, 500); // Debounce de 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [postalCode, onPostalCodeSearch]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};

    if (!postalCode || postalCode.length !== 5 || !/^\d+$/.test(postalCode)) {
      newErrors.postalCode = 'El código postal debe tener 5 dígitos';
    }

    if (!stateId) {
      newErrors.stateId = 'El estado es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        postalCode,
        stateId,
        municipalityId,
        cityId,
        neighborhood,
      });
    }
  };

  return (
    <View className="flex-1">
      <FormField
        label="Código Postal"
        required
        error={errors.postalCode}
        inputProps={{
          value: postalCode,
          onChangeText: (text) => {
            const numericText = text.replace(/[^0-9]/g, '').slice(0, 5);
            setPostalCode(numericText);
            if (errors.postalCode) setErrors((prev) => ({ ...prev, postalCode: undefined }));
          },
          placeholder: "44100",
          keyboardType: "numeric",
          maxLength: 5,
        }}
      />

      {isSearching && (
        <View className="flex-row items-center gap-2 mb-4">
          <ActivityIndicator size="small" color="#18CB96" />
          <Typography variant="caption" className="text-muted-foreground">
            Buscando ubicación...
          </Typography>
        </View>
      )}

      {stateId && stateName && (
        <View className="mb-4">
          <Typography variant="body" className="mb-2 text-foreground">
            Estado
          </Typography>
          <View className="rounded-md border border-border bg-background px-4 py-3">
            <Typography variant="body" className="text-foreground">
              {stateName}
            </Typography>
          </View>
        </View>
      )}

      {municipalityId && municipalityName && (
        <View className="mb-4">
          <Typography variant="body" className="mb-2 text-foreground">
            Municipio
          </Typography>
          <View className="rounded-md border border-border bg-background px-4 py-3">
            <Typography variant="body" className="text-foreground">
              {municipalityName}
            </Typography>
          </View>
        </View>
      )}

      {cityId && cityName && (
        <View className="mb-4">
          <Typography variant="body" className="mb-2 text-foreground">
            Ciudad
          </Typography>
          <View className="rounded-md border border-border bg-background px-4 py-3">
            <Typography variant="body" className="text-foreground">
              {cityName}
            </Typography>
          </View>
        </View>
      )}

      {neighborhoods.length > 1 && (
        <FormField
          label="Colonia"
          error={errors.neighborhood}
          inputProps={{
            value: neighborhood || '',
            onChangeText: (text) => {
              setNeighborhood(text || null);
            },
            placeholder: "Selecciona o escribe tu colonia",
          }}
        />
      )}

      {neighborhoods.length === 1 && (
        <View className="mb-4">
          <Typography variant="body" className="mb-2 text-foreground">
            Colonia
          </Typography>
          <View className="rounded-md border border-border bg-background px-4 py-3">
            <Typography variant="body" className="text-foreground">
              {neighborhoods[0]}
            </Typography>
          </View>
        </View>
      )}

      <SuntusButton
        variant="primary"
        onPress={handleSubmit}
        disabled={isLoading || isSearching}
        className="mt-6"
        title={isLoading ? 'Guardando...' : 'Continuar'}
      />
    </View>
  );
}

