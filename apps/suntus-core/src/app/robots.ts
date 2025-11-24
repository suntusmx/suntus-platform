import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/', // Panel admin no debe indexarse
    },
    sitemap: undefined, // No hay sitemap para admin
  };
}

