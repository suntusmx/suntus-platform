import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@suntus/ui",
    "@suntus/core",
    "nativewind",
    "react-native-css-interop",
    "lucide-react-native",
    "@react-native/assets-registry",
  ],
  webpack: (config, { isServer }) => {
    // Alias react-native a react-native-web para compartir componentes
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };

    // Asegurar que react-native-web se resuelva correctamente
    // IMPORTANTE: Las extensiones .web.* deben estar ANTES de las extensiones normales
    // para que Webpack priorice los archivos .web.tsx en web
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      ...(config.resolve.extensions || []),
    ];

    // Asegurar que Webpack resuelva correctamente los archivos .web.*
    // Esto es crítico para que Next.js encuentre los componentes correctos
    config.resolve.mainFields = ['browser', 'module', 'main'];

    return config;
  },
};

export default nextConfig;
