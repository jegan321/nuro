import { CreateElement } from './create-element.js'
import { VNode } from './vnode.js'

interface BaseComponent {
  [state: string]: any
  props?: Record<string, any>
  beforeInit?: () => void
  beforeMount?: () => void
  afterMount?: () => void
  beforeRender?: () => void
  afterRender?: () => void
  beforeUnmount?: () => void
  afterUnmount?: () => void
}

interface RenderComponent extends BaseComponent {
  render: (createElement: CreateElement) => VNode
}

interface TemplateComponent extends BaseComponent {
  $template: string
  $includes?: Record<string, new () => Component>
}

export type Component = RenderComponent | TemplateComponent

export interface ComponentClass {
  new (props: any): Component
}
