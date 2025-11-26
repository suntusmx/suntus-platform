/// <reference types="node" />
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Interfaz para la respuesta del API de ubicaciones
 */
interface LocationHierarchy {
  success: boolean;
  message: string;
  data: StateData[];
}

interface StateData {
  name: string;
  municipalities: MunicipalityData[];
}

interface MunicipalityData {
  name: string;
  neighborhoods: NeighborhoodData[];
}

interface NeighborhoodData {
  name: string;
  postalCodes: string[];
}

/**
 * URL del servicio de ubicaciones
 */
const LOCATIONS_API_URL = process.env.LOCATIONS_API_URL || 'http://localhost:4000/api/locations/hierarchy';

/**
 * Obtiene la jerarquía de ubicaciones desde el API
 */
async function fetchLocationHierarchy(): Promise<LocationHierarchy> {
  console.log(`📡 Obteniendo datos de ubicaciones desde: ${LOCATIONS_API_URL}`);
  
  const response = await fetch(LOCATIONS_API_URL);
  
  if (!response.ok) {
    throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json() as LocationHierarchy;
  
  if (!data.success) {
    throw new Error(`API retornó error: ${data.message}`);
  }
  
  return data;
}

/**
 * Crea o actualiza el país México
 */
async function ensureMexicoCountry() {
  const mexicoData = {
    code: 'MX',
    name: {
      es: 'México',
      en: 'Mexico',
      native: 'México',
    } as Prisma.InputJsonValue,
    capital: 'Ciudad de México',
    currency: ['MXN'],
    phone: [52],
    continent: 'NA',
  };

  return await prisma.country.upsert({
    where: { code: 'MX' },
    update: mexicoData,
    create: mexicoData,
  });
}

/**
 * Procesa y carga los datos de ubicaciones en la BD
 */
async function seedMexicoLocations() {
  console.log('🌍 Iniciando seed de ubicaciones de México...');

  // 1. Asegurar que México existe
  const mexico = await ensureMexicoCountry();
  console.log('✅ País México creado/actualizado');

  // 2. Obtener datos del API
  const hierarchy = await fetchLocationHierarchy();
  console.log(`✅ Obtenidos ${hierarchy.data.length} estados del API`);

  let totalStates = 0;
  let totalMunicipalities = 0;
  let totalCities = 0;
  let totalPostalCodes = 0;

  // 3. Procesar cada estado
  for (const stateData of hierarchy.data) {
    // Buscar estado existente por nombre (JSONB)
    const existingState = await prisma.state.findFirst({
      where: {
        countryCode: mexico.code,
        name: {
          path: ['es'],
          equals: stateData.name,
        },
      },
    });

    // Crear o actualizar estado
    const state = existingState
      ? await prisma.state.update({
          where: { id: existingState.id },
          data: {
            name: {
              es: stateData.name,
              en: stateData.name,
            } as Prisma.InputJsonValue,
            code: getStateCode(stateData.name),
          },
        })
      : await prisma.state.create({
          data: {
            countryCode: mexico.code,
            name: {
              es: stateData.name,
              en: stateData.name,
            } as Prisma.InputJsonValue,
            code: getStateCode(stateData.name),
          },
        });

    totalStates++;
    console.log(`  📍 Estado: ${stateData.name} (${stateData.municipalities.length} municipios)`);

    // 4. Procesar cada municipio del estado
    for (const municipalityData of stateData.municipalities) {
      // Buscar municipio existente
      const existingMunicipality = await prisma.municipality.findFirst({
        where: {
          stateId: state.id,
          name: {
            path: ['es'],
            equals: municipalityData.name,
          },
        },
      });

      const municipality = existingMunicipality
        ? await prisma.municipality.update({
            where: { id: existingMunicipality.id },
            data: {
              name: {
                es: municipalityData.name,
                en: municipalityData.name,
              } as Prisma.InputJsonValue,
            },
          })
        : await prisma.municipality.create({
            data: {
              stateId: state.id,
              name: {
                es: municipalityData.name,
                en: municipalityData.name,
              } as Prisma.InputJsonValue,
            },
          });

      totalMunicipalities++;

      // 5. Procesar cada neighborhood (ciudad/localidad) del municipio
      for (const neighborhoodData of municipalityData.neighborhoods) {
        // Buscar ciudad existente
        const existingCity = await prisma.city.findFirst({
          where: {
            municipalityId: municipality.id,
            name: {
              path: ['es'],
              equals: neighborhoodData.name,
            },
          },
        });

        const city = existingCity
          ? await prisma.city.update({
              where: { id: existingCity.id },
              data: {
                name: {
                  es: neighborhoodData.name,
                  en: neighborhoodData.name,
                } as Prisma.InputJsonValue,
              },
            })
          : await prisma.city.create({
              data: {
                municipalityId: municipality.id,
                name: {
                  es: neighborhoodData.name,
                  en: neighborhoodData.name,
                } as Prisma.InputJsonValue,
              },
            });

        totalCities++;

        // 6. Procesar cada código postal
        for (const postalCode of neighborhoodData.postalCodes) {
          await prisma.postalCode.upsert({
            where: { code: postalCode },
            update: {
              cityId: city.id,
              municipalityId: municipality.id,
            },
            create: {
              code: postalCode,
              cityId: city.id,
              municipalityId: municipality.id,
            },
          });

          totalPostalCodes++;
        }
      }
    }
  }

  console.log('\n✅ Seed completado exitosamente:');
  console.log(`   - Estados: ${totalStates}`);
  console.log(`   - Municipios: ${totalMunicipalities}`);
  console.log(`   - Ciudades/Localidades: ${totalCities}`);
  console.log(`   - Códigos postales: ${totalPostalCodes}`);
}

/**
 * Obtiene el código del estado basado en su nombre
 * Retorna códigos comunes de estados mexicanos
 */
function getStateCode(stateName: string): string | null {
  const stateCodes: Record<string, string> = {
    'Aguascalientes': 'AGU',
    'Baja California': 'BC',
    'Baja California Sur': 'BCS',
    'Campeche': 'CAM',
    'Chiapas': 'CHP',
    'Chihuahua': 'CHH',
    'Ciudad de México': 'CDMX',
    'Coahuila': 'COA',
    'Colima': 'COL',
    'Durango': 'DUR',
    'Guanajuato': 'GUA',
    'Guerrero': 'GRO',
    'Hidalgo': 'HID',
    'Jalisco': 'JAL',
    'México': 'MEX',
    'Michoacán': 'MIC',
    'Morelos': 'MOR',
    'Nayarit': 'NAY',
    'Nuevo León': 'NL',
    'Oaxaca': 'OAX',
    'Puebla': 'PUE',
    'Querétaro': 'QUE',
    'Quintana Roo': 'QR',
    'San Luis Potosí': 'SLP',
    'Sinaloa': 'SIN',
    'Sonora': 'SON',
    'Tabasco': 'TAB',
    'Tamaulipas': 'TAM',
    'Tlaxcala': 'TLA',
    'Veracruz': 'VER',
    'Yucatán': 'YUC',
    'Zacatecas': 'ZAC',
  };

  return stateCodes[stateName] || null;
}

/**
 * Función principal
 */
async function main() {
  try {
    await seedMexicoLocations();
  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

