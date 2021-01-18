import { Component, ComponentClass } from './component'

export interface Nuro {
  mount: Mount
  unmount: Unmount
  compileTemplate: CompileTemplate
  include: Include
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
