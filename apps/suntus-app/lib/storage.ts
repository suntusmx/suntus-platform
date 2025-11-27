import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Storage multiplataforma para suntus-app
 * Usa SecureStore en móvil y localStorage en web
 */

/**
 * Obtiene un valor del storage
 * @param key - Clave del valor a obtener
 * @returns Valor almacenado o null si no existe
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      // En web, usar localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } else {
      // En móvil, usar SecureStore
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return null;
  }
}

/**
 * Guarda un valor en el storage
 * @param key - Clave del valor
 * @param value - Valor a almacenar
 */
export async function setItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      // En web, usar localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } else {
      // En móvil, usar SecureStore
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
    throw error;
  }
}

/**
 * Elimina un valor del storage
 * @param key - Clave del valor a eliminar
 */
export async function removeItem(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      // En web, usar localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } else {
      // En móvil, usar SecureStore
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
    // No lanzar error, solo loguear
  }
}

