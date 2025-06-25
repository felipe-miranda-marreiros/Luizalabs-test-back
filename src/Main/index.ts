import 'dotenv/config'
import { app } from './Libs/Express/Express'
import { ENV } from '@/Shared/Env/Env'

app.listen(ENV.APP_PORT, async () => {
  console.log(`Server running on port ${ENV.APP_PORT}`)
})
