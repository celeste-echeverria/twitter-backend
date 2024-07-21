module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^@domains/(.*)$': '<rootDir>/src/domains/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@types': '<rootDir>/src/types',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.service.impl.ts', 
    '!**/node_modules/**', 
    '!**/dist/**', 
    '!**/*.d.ts', 
  ],
  coverageDirectory: 'coverage', 
  coverageReporters: ['json', 'lcov', 'text', 'clover'], 
};
