import { InjectedProps } from './component-proxy.js'
import { Component, ComponentClass } from './component.js'
import { Plugin } from './plugin.js'

export interface GlobalAPI {
  /**
   * Mounts a component to a DOM element and renders the UI
   * @param ComponentClass A class that contains a $template string or a render method
   * @param element The element in the DOM to render the component onto
   * @param props Data for the component
   * @returns An instance of ComponentClass with reactivity added
   */
  mount: Mount

  /**
   * Unmounts the component attached to the given DOM element
   * @param element The element where a component has been mounted
   * @returns True if a component was unmounted or false if no component was attached
   */
  unmount: Unmount

  /**
   * Takes an HTML-like template and converts it into a JavaScript function that returns
   * a VNode
   * @param template HTML code that may contain expressions and directives
   * @returns JavaScript code the compiled function
   */
  compileTemplate: CompileTemplate

  /**
   * Allows the given component to be referenced from any template inside the application
   * without using the $includes object
   * @param componentName The name of the tag used in the template to reference the component
   * @param ComponentClass The component to include
   */
  include: Include

  /**
   * Adds properties to all component instances created by Nuro
   * @param mixin An object containing each property to be added to the components
   */
  mixin: Mixin

  /**
   * Installs a Nuro plugin
   * @param plugin The plugin to install
   * @param options Parameters for the plugin
   */
  install: Install
}

interface Mount {
  <P, T extends Component>(ComponentClass: new (props: P) => T, element?: Element, props?: P): T &
    InjectedProps
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
