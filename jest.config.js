module.exports = {
  testEnvironment: 'node',
  globalSetup: './jest.global-setup.js',
  setupFilesAfterEnv: ['./jest.setup.js'],
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*test*.js',
    '!src/**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  testMatch: [
    '**/test/**/*.test.js',
    '**/test/**/*.spec.js'
  ],
  moduleFileExtensions: ['js', 'json'],
  testTimeout: 30000,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  passWithNoTests: true
};