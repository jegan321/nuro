import { ComponentProxy, ComponentProxyClass } from './component-proxy.js'
import { Plugin } from './plugin.js'

export interface GlobalAPI {
  mount: Mount
  unmount: Unmount
  compileTemplate: CompileTemplate
  include: Include
  mixin: Mixin
  install: Install
}

interface Mount {
  (ComponentClass: ComponentProxyClass, element?: Element, props?: Record<string, any>): ComponentProxy
}

interface Unmount {
  (element: Element): boolean
}

interface CompileTemplate {
  (template: string): string
}

interface Include {
  (componentName: string, ComponentClass: ComponentProxyClass): void
}

interface Mixin {
  (mixin: Record<string, unknown>): void
}

interface Install {
  (plugin: Plugin, options: Record<string, unknown>): void
}
