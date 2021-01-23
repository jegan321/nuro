import { GlobalAPI } from './global-api'

export interface Plugin {
  install: (globalAPI: GlobalAPI, options: Record<string, unknown>) => void
}
