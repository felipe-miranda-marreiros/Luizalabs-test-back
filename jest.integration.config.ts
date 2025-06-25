import config from './jest.config'

config.testMatch = ['**/*.test.ts']
config.globalTeardown = '<rootDir>/src/Tests/Integration/Config/Teardown.ts'
config.globalSetup = '<rootDir>/src/Tests/Integration/Config/GlobalSetup.ts'
config.coverageDirectory = './coverage/integration'

module.exports = config
