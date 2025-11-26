const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Configuración para monorepo
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Configuración para web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Alias para react-native-worklets -> react-native-worklets-core
// react-native-reanimated intenta cargar 'react-native-worklets/plugin' pero el paquete correcto es 'react-native-worklets-core'
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  'react-native-worklets': 'react-native-worklets-core',
};

// Deshabilitar Hermes para web (Hermes es solo para Android/iOS nativo)
// Esto previene el error de MIME type 'application/json' con transform.engine=hermes
config.transformer = {
  ...config.transformer,
  getTransformOptions: async (entryPoints, options) => {
    // Forzar JavaScript para web, no Hermes bytecode
    if (options.platform === 'web') {
      return {
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
        preloadedModules: false,
        ramGroups: [],
      };
    }
    return {
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    };
  
  },
};

// Aplicar NativeWind
// IMPORTANTE: NativeWind detecta tailwind.config.js en el directorio del proyecto
// Creamos tailwind.config.js local que importa desde packages/ui para asegurar v3
module.exports = withNativeWind(config, { 
  input: '../../packages/ui/src/styles/global.css',
});

