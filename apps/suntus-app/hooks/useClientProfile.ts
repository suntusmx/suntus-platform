import { useState, useEffect } from 'react';
import { api, getAccessToken } from '../lib/api';

export interface ClientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  initialWeight?: number;
  height?: number;
  postalCode?: string;
  stateId?: string;
  municipalityId?: string;
  cityId?: string;
  neighborhood?: string;
  goal?: 'LOSE_FAT' | 'BUILD_MUSCLE' | 'MAINTENANCE' | 'PERFORMANCE';
  budget?: 'LOW' | 'MEDIUM' | 'HIGH' | 'NO_BUDGET';
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

/**
 * Hook para verificar y obtener el ClientProfile del usuario autenticado
 * Solo hace la petición si el usuario está autenticado (tiene token)
 */
export function useClientProfile() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Verificar si hay token antes de hacer la petición
      const token = await getAccessToken();
      
      if (!token) {
        // No hay token, usuario no autenticado
        setProfile(null);
        setError(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await api.get<ClientProfile | null>('/client-profile');
        setProfile(data);
        setError(null);
      } catch (err: any) {
        // Si es 404, no tiene perfil (no es error)
        if (err.message?.includes('404') || err.message?.includes('CLIENT_PROFILE_REQUIRED')) {
          setProfile(null);
          setError(null);
        } else {
          setError(err);
          setProfile(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading, error, hasProfile: !!profile };
}

