import { PrismaClient, Prisma } from '@prisma/client';
import { countries } from 'countries-list';

const prisma = new PrismaClient();

/**
 * Traduce nombres de países comunes al español
 */
function translateCountryName(name: string): string {
  const translations: Record<string, string> = {
    Mexico: 'México',
    'United States': 'Estados Unidos',
    Spain: 'España',
    Colombia: 'Colombia',
    Argentina: 'Argentina',
    Chile: 'Chile',
    Peru: 'Perú',
    // Agregar más traducciones según necesidad
  };

  return translations[name] || name;
}

async function main() {
  console.log('🌍 Iniciando seed de países...');

  // Seed de países usando countries-list
  for (const [code, data] of Object.entries(countries)) {
    await prisma.country.upsert({
      where: { code },
      update: {
        name: {
          es: translateCountryName(data.name),
          en: data.name,
          native: data.native,
        } as Prisma.InputJsonValue,
        capital: data.capital || null,
        currency: data.currency || [],
        phone: data.phone || [],
        continent: data.continent || null,
      },
      create: {
        code,
        name: {
          es: translateCountryName(data.name),
          en: data.name,
          native: data.native,
        } as Prisma.InputJsonValue,
        capital: data.capital || null,
        currency: data.currency || [],
        phone: data.phone || [],
        continent: data.continent || null,
      },
    });
  }

  console.log(`✅ ${Object.keys(countries).length} países seedeados exitosamente`);

  // TODO: Agregar seed de estados/ciudades de México usando datos del INEGI
  // Por ahora solo países
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
