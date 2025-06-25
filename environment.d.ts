import { Environment } from '@/Shared/Env/Env'

export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment {}
  }
}
