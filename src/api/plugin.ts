import { GlobalAPI } from './global-api.js'

export interface Plugin {
  install: (globalAPI: GlobalAPI, options?: any) => void
}
