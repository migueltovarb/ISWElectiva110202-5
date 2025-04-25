import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};

export default config;

    module.exports = {
        preset: "ts-jest",
        testEnvironment: "jsdom",
        setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
        };