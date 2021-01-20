import { Component, ComponentClass } from './component'
import { Plugin } from './plugin'

export interface Nuro {
  mount: Mount
  unmount: Unmount
  compileTemplate: CompileTemplate
  include: Include
  install: Install
}

interface Mount {
  (ComponentClass: ComponentClass, element?: Element, props?: Record<string, any>): Component
}

interface Unmount {
  (element: Element): boolean
}

interface CompileTemplate {
  (template: string): string
}

interface Include {
  (componentName: string, ComponentClass: ComponentClass): void
}

interface Install {
  (plugin: Plugin, options: Record<string, unknown>): void
}
