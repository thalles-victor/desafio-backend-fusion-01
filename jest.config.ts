import type { Config } from 'jest';

const config: Config = {
  // verbose: true,
  moduleNameMapper: {
    '^@types/(.*)$': '<rootDir>/src/@types/$1',
    '^@const$': '<rootDir>/src/@const/index.ts', // Para o import do alias direto
    '^@const/(.*)$': '<rootDir>/src/@const/$1', // Para sub-imports caso existam
    '^@utils$': '<rootDir>/src/@utils/index.ts', // Para o import do alias direto
    '^@utils/(.*)$': '<rootDir>/src/@utils/$1', // Para sub-imports caso existam
    '^@validators$': '<rootDir>/src/@validators/index.ts', // Para o import do alias direto
    '^@validators/(.*)$': '<rootDir>/src/@validators/$1', // Para sub-imports caso existam
    '^src/(.*)$': '<rootDir>/src/$1', // Mapeamento para o src/
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

export default config;
