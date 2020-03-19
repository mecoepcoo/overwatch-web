import { GlobalConfig } from './interface'
import { recordWindowErrorLog, recordUnhandledRejectionLog } from './module/uncaught-error'
import { recordHttpLog } from './module/http-error'
import { recordResourceErrorLog } from './module/resource-error'
import Config from './global'

export function initConfig(globalConfig: GlobalConfig) {
  Config.set(globalConfig)
}

export function initOverwatch(globalConfig: GlobalConfig) {
  initConfig(globalConfig)

  recordWindowErrorLog()
  recordUnhandledRejectionLog()
  recordHttpLog()
  recordResourceErrorLog()

  console.log('overwatch-web SDK is initialized.')
}
