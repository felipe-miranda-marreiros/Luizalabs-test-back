/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

const config: Config = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/Infrastructure/(.*)$': '<rootDir>/src/Infrastructure/$1',
    '^@/Main/(.*)$': '<rootDir>/src/Main/$1',
    '^@/Presentation/(.*)$': '<rootDir>/src/Presentation/$1',
    '^@/Application/(.*)$': '<rootDir>/src/Application/$1',
    '^@/Shared/(.*)$': '<rootDir>/src/Shared/$1',
    '^@/Tests/(.*)$': '<rootDir>/src/Tests/$1',
    '^@/Domain/(.*)$': '<rootDir>/src/Domain/$1'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
}

export default config
