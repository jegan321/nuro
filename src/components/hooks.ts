import { Component } from '../api/component.js'

export function callHook(component: Component, hookName: string) {
  if (component[hookName]) {
    component[hookName]()
  }
}
