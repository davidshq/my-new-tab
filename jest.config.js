module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/js/$1'
  },
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/**/*.test.js',
    '!background.js',
    '!popup.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  moduleFileExtensions: ['js', 'json'],
  transform: {},
  testTimeout: 10000,
  testEnvironmentOptions: {
    url: 'http://localhost'
  }
}; 