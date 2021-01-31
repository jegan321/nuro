import { CreateElement } from './create-element.js'
import { VNode } from './vnode.js'

export interface Component {
  props: Record<string, any>
  [state: string]: any
  $element: Element
  $vnode: VNode
  $includes: Map<string, ComponentClass>
  render: Render
  $update: () => void
  beforeInit: () => void
  beforeMount: () => void
  afterMount: () => void
  beforeRender: () => void
  afterRender: () => void
  beforeUnmount: () => void
  afterUnmount: () => void
}

export interface ComponentClass {
  new (): Component
  template?: string
  includes?: Record<string, ComponentClass>
}

export interface Render {
  (createElement: CreateElement): VNode
}
