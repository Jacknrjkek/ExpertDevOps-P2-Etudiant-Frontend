module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',

  roots: ['<rootDir>/src/'],

  testMatch: ['**/+(*.)+(spec).+(ts)'],

  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  collectCoverage: true,
  coverageReporters: ['html'],
};
