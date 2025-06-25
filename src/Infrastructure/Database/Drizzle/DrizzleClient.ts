import { ENV } from '@/Shared/Env/Env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: ENV.DATABASE_URL
})

export const db = drizzle({ client: pool })
