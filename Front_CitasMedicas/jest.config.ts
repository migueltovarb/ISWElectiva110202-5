import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // si usas CSS Modules
    },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // si tienes este archivo
};
