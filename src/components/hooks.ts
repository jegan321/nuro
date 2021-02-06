import { ComponentProxy } from '../api/component-proxy.js'

export function callHook(component: ComponentProxy, hookName: string) {
  if (component[hookName]) {
    component[hookName]()
  }
}
