/**
 * Configuración de ambientes de la aplicación
 */

export type Environment = 'local' | 'development';

interface EnvironmentConfig {
  baseUrl: string;
  name: string;
}

const environments: Record<Environment, EnvironmentConfig> = {
  local: {
    name: 'Local',
    baseUrl: 'http://localhost:3000',
  },
  development: {
    name: 'Development',
    baseUrl: 'https://app-cultural-606100971917.southamerica-east1.run.app',
  },
};

/**
 * Bandera para cambiar entre ambiente de producción y local
 * true = production (servidor en la nube)
 * false = local (localhost:3000)
 */
const PRODUCTION = true;

/**
 * Ambiente actual seleccionado
 */
const CURRENT_ENVIRONMENT: Environment = PRODUCTION ? 'development' : 'local';

/**
 * Configuración del ambiente actual
 */
export const ENV = {
  ...environments[CURRENT_ENVIRONMENT],
  isProduction: PRODUCTION,
  isLocal: !PRODUCTION,
  current: CURRENT_ENVIRONMENT,
};

/**
 * Helper para obtener la URL base según el ambiente
 */
export const getBaseUrl = (): string => {
  return ENV.baseUrl;
};
