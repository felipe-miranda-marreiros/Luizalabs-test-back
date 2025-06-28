import { Server } from 'http'
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer
} from '@testcontainers/postgresql'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Wait } from 'testcontainers'
import { pool } from '../../../Infrastructure/Database/Drizzle/DrizzleClient'
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis'
import { redisAdapter } from '@/Infrastructure/Cache/RedisAdapter'
import { ENV } from '@/Shared/Env/Env'

export const testContainers = {
  db: null as unknown as StartedPostgreSqlContainer,
  server: null as unknown as Server,
  redis: null as unknown as StartedRedisContainer,
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
  async initRedisContainer() {
    this.redis = await new RedisContainer('redis')
      .withWaitStrategy(Wait.forListeningPorts())
      .start()
    ENV.REDIS_URL = this.redis.getConnectionUrl()
  },
  setupEnvs() {
    process.env.APP_PORT = 9000
    process.env.JWT_SECRET = 'JWT_TEST_SECRECT'
    process.env.NODE_ENV = 'test'
  },
  async initAll() {
    await this.initRedisContainer()
    await this.initSQLContainer()
    await redisAdapter.build()
    this.setupEnvs()
  },
  async closeAll() {
    pool.end().then(async () => {
      await this.db.stop()
      await this.redis.stop()
      this.server.close()
    })
  }
}
