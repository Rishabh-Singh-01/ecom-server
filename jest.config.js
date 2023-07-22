/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  roots: ['<rootDir>/tests'],
  setupFiles: ['dotenv/config'],
  verbose: true,
  displayName: {
    name: 'node-express',
    color: 'greenBright',
  },
  detectOpenHandles: true,
  testTimeout: 100000,
};
