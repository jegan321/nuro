import { Nuro } from './nuro'

export interface Plugin {
  install: (Nuro: Nuro, options: Record<string, unknown>) => void
}
