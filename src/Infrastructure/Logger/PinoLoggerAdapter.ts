import { Logger } from '@/Application/Contracts/Logger/Logger'
import pino, { Logger as PinoLogger } from 'pino'

const isTestEnv = process.env.NODE_ENV === 'test'

export const baseLogger = pino(
  isTestEnv
    ? { level: 'silent' }
    : {
        level: 'info',
        timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true
          }
        },
        redact: {
          paths: ['[0].password', 'password'],
          censor: '[REDACTED]'
        }
      }
)

export const logger: Logger<PinoLogger> = {
  logger: null as unknown as PinoLogger,
  debug: function (message: string, ...meta: any[]): void {
    this.logger.debug(meta, message)
  },
  info: function (message: string, ...meta: any[]): void {
    this.logger.info(meta, message)
  },
  warn: function (message: string, ...meta: any[]): void {
    this.logger.warn(meta, message)
  },
  error: function (message: string, ...meta: any[]): void {
    this.logger.error(meta, message)
  },
  build: function (): void {
    this.logger = baseLogger.child({ requestId: Date.now() })
  }
}
