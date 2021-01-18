import { Component } from './component'

export function callHook(component: Component, hookName: string) {
  if (component[hookName]) {
    component[hookName]()
  }
}
