import { Component } from '../api/component.js'
import { ComponentProxy } from './component-proxy.js'

const mixins: Array<Record<string, unknown>> = []

export function addMixin(mixin: Record<string, unknown>): void {
  mixins.push(mixin)
}

/*
  Add all properties from the mixin object to the component.
  // TODO: if prop is a lifecycle hook, use both instead of replacing the component's
*/
export function applyMixins(component: Component | ComponentProxy): void {
  mixins.forEach(mixin => {
    Object.keys(mixin).forEach(prop => {
      component[prop] = mixin[prop]
    })
  })
}
