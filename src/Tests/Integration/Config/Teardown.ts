import 'tsconfig-paths/register'

import { testContainers } from './TestContainers'

process.on('uncaughtException', (error) => {})

export default async function teardown() {
  await testContainers.closeAll()
}
