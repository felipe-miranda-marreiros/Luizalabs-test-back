import config from './jest.config'
config.testMatch = ['**/*.spec.ts']
config.setupFiles = ['<rootDir>/src/Tests/Unit/Config/SetupFiles.ts']
config.coverageDirectory = './coverage/unit'
module.exports = config
