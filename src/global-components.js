import { clone } from './utils'

const globalComponents = {}

export function addGlobalComponent (name, definition) {
  globalComponents[name] = definition
}

export function getGlobalComponents () {
  return clone(globalComponents)
}