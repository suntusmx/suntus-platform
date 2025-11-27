import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTA: output: "export" está comentado porque tenemos API routes (/api/auth/[...auth0])
  // Si necesitas static export, mueve las API routes a otro servicio o usa middleware
  // output: "export", // Static export
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
    const existingExtensions = config.resolve.extensions || [];
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...existingExtensions.filter((ext: string) => !ext.startsWith('.web')),
    ];

    return config;
  },
};

export default nextConfig;
