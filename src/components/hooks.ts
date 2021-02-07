import { ComponentProxy } from '../api/component-proxy.js'
import { Component } from '../api/component.js'

export function callHook(component: Component | ComponentProxy, hookName: string) {
  if (component[hookName]) {
    component[hookName]()
  }
}
