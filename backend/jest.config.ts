// import type { Config } from 'jest';

// const config: Config = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   testMatch: ['**/tests/**/*.test.ts'],
//   moduleFileExtensions: ['ts', 'js', 'json'],
//   clearMocks: true,
//   verbose: true,
//   transform: {
//     '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
//   },
// };

// export default config;


import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: {
        noEmit: true,
        isolatedModules: true
      }
    }
  }
};

export default config;