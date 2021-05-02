import { CreateElement } from './create-element.js'
import { VNode } from './vnode.js'

export abstract class UserComponent<Props> {
  $template?: string
  $includes?: Record<string, any>
  props: Props
  constructor(props: Props) {
    this.props = props
  }
  beforeInit() {}
  beforeMount() {}
  afterMount() {}
  beforeRender() {}
  afterRender() {}
  beforeUnmount() {}
}

interface BaseComponent {
  [state: string]: any
  props?: Record<string, any>
  beforeInit?: () => void
  beforeMount?: () => void
  afterMount?: () => void
  beforeRender?: () => void
  afterRender?: () => void
  beforeUnmount?: () => void
}

export interface RenderComponent extends BaseComponent {
  render: (createElement: CreateElement) => VNode
}

export interface Render {
  (createElement: CreateElement): VNode
}

export interface TemplateComponent extends BaseComponent {
  $template: string
  $includes?: Record<string, any>
}

export type Component = RenderComponent | TemplateComponent

export interface ComponentClass {
  new (props: any): Component
}
