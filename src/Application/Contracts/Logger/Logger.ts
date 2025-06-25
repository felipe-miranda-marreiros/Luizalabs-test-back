export interface Logger<TLogger> {
  logger: TLogger
  build(): void
  debug(message: string, ...meta: any[]): void
  info(message: string, ...meta: any[]): void
  warn(message: string, ...meta: any[]): void
  error(message: string, ...meta: any[]): void
}
