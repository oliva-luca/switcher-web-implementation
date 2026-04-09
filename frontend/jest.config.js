module.exports = {

  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],

  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Asegúrate de que este archivo use sintaxis correcta
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // Cambia a babel-jest para TS y JS
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!your-module-to-transform)", // Ajusta según sea necesario
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text'],
};