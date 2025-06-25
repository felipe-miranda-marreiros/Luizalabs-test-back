import { Logger } from '@/Application/Contracts/Logger/Logger'

const logger: Logger<unknown> = {
  logger: undefined,
  build: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}

jest.mock('@/Infrastructure/Logger/PinoLoggerAdapter', () => {
  return {
    baseLogger: jest.fn(),
    logger
  }
})
