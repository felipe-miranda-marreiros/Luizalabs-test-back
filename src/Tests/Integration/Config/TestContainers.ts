import { Server } from 'http'
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer
} from '@testcontainers/postgresql'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Wait } from 'testcontainers'
import { pool } from '../../../Infrastructure/Database/Drizzle/DrizzleClient'

export const testContainers = {
  db: null as unknown as StartedPostgreSqlContainer,
  server: null as unknown as Server,
  async initSQLContainer() {
    this.db = await new PostgreSqlContainer('postgres:latest')
      .withName('test_db')
      .withPassword('password')
      .withUser('root')
      .withDatabase('test_db')
      .withTmpFs({
        '/var/lib/postgresql/data': 'rw,size=256m'
      })
      .withSharedMemorySize(256 * 1024 * 1024) // Default shmem size = 64mb.
      .withEnvironment({ PGDATA: '/var/lib/postgresql/data/pgdata' })
      .withCommand([
        'postgres',
        '-c',
        'shared_buffers=256MB',
        '-c',
        'fsync=off',
        '-c',
        'synchronous_commit=off',
        '-c',
        'full_page_writes=off'
      ])
      .withWaitStrategy(Wait.forListeningPorts())
      .start()

    process.env.DATABASE_URL = this.db.getConnectionUri()
    await migrate(drizzle(this.db.getConnectionUri()), {
      migrationsFolder: 'drizzle'
    })
  },
  setupEnvs() {
    process.env.APP_PORT = 9000
    process.env.JWT_SECRET = 'JWT_TEST_SECRECT'
    process.env.NODE_ENV = 'test'
  },
  async initAll() {
    await this.initSQLContainer()
    this.setupEnvs()
  },
  async closeAll() {
    pool.end().then(async () => {
      await this.db.stop()
      this.server.close()
    })
  }
}
