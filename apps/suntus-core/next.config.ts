import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@suntus/ui", "@suntus/core", "nativewind", "react-native-css-interop"],
  webpack: (config, { isServer }) => {
    // Alias react-native a react-native-web para compartir componentes
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };

    // Asegurar que react-native-web se resuelva correctamente
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...(config.resolve.extensions || []),
    ];

    return config;
  },
};

export default nextConfig;
