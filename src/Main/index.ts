import 'dotenv/config'
import { app } from './Libs/Express/Express'
import { ENV } from '@/Shared/Env/Env'
import { redisAdapter } from '@/Infrastructure/Cache/RedisAdapter'

app.listen(ENV.APP_PORT, async () => {
  console.log(`Server running on port ${ENV.APP_PORT}`)
  await redisAdapter.build()
})
