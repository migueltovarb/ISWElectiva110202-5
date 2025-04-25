module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['esbuild-jest', { 
        sourcemap: true,
        loaders: {
            '.js': 'jsx',
            '.ts': 'tsx'
        }
        }]
    },
    testPathIgnorePatterns: ['/node_modules/'],
    };

    module.exports = {
        testEnvironment: 'jsdom',
        setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
        transform: {
            '^.+\\.(js|jsx|ts|tsx)$': ['esbuild-jest', {
            sourcemap: true,
            loaders: {
                '.js': 'jsx',
                '.ts': 'tsx'
            }
            }]
        },
        moduleNameMapper: {
            '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        },
        };