import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })
import 'tsconfig-paths/register'
import { testContainers } from './TestContainers'

export default async function setup() {
  await testContainers.initAll()
}
