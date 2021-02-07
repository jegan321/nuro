import { InjectedProps } from './component-proxy.js'
import { Component, ComponentClass } from './component.js'
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
  <T extends Component>(
    ComponentClass: new (props: any) => T,
    element?: Element,
    props?: Record<string, any>
  ): T & InjectedProps
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

interface Mixin {
  (mixin: Record<string, unknown>): void
}

interface Install {
  (plugin: Plugin, options: Record<string, unknown>): void
}
