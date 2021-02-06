import { ComponentProxyClass } from '../api/component-proxy.js'

export const globalIncludes = new Map<string, ComponentProxyClass>()

export function include(componentName: string, ComponentClass: ComponentProxyClass): void {
  globalIncludes.set(componentName, ComponentClass)
}
