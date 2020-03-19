import { GlobalConfig } from './interface'

const DEFAULT_DELAY = 0
const DEFAULT_RANDOM = 1
const DEFAULT_REPEAT = 0
const DEFAULT_LOCAL_EXP = 10
const DEFAULT_LANGUAGE = 'javascript'
const DEFAULT_DEV_ENABLE = false

let globalConfig: GlobalConfig = {
  delay: DEFAULT_DELAY,
  random: DEFAULT_RANDOM,
  repeat: DEFAULT_REPEAT,
  localExp: DEFAULT_LOCAL_EXP,
  language: DEFAULT_LANGUAGE,
  devEnable: DEFAULT_DEV_ENABLE,
  callback: () => {}
}

export default {
  set: (configObj: GlobalConfig) => {
    // TODO: 这里应该做一些参数验证
    Object.assign(globalConfig, configObj)
    return true
  },
  get: (configKey: keyof GlobalConfig) => {
    return globalConfig[configKey] || null
  }
}
