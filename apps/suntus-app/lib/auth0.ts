import Auth0 from 'react-native-auth0';

/**
 * Configuración de Auth0 para suntus-app
 * Usa variables de entorno con prefijo EXPO_PUBLIC_
 * Todas las variables son OBLIGATORIAS
 */
const domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN!;
const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!;
const audience = process.env.EXPO_PUBLIC_AUTH0_AUDIENCE!;

if (!domain || !clientId || !audience) {
  throw new Error('Auth0 configuration is missing. Check EXPO_PUBLIC_AUTH0_DOMAIN, EXPO_PUBLIC_AUTH0_CLIENT_ID, and EXPO_PUBLIC_AUTH0_AUDIENCE');
}

export const auth0 = new Auth0({
  domain,
  clientId,
});

export const auth0Config = {
  domain,
  clientId,
  audience,
};

