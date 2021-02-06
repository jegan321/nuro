import { CreateElement } from './create-element.js'
import { VNode } from './vnode.js'

export interface ComponentProxy {
  props: Record<string, any>
  [state: string]: any
  $element: Element
  $vnode: VNode
  $includes: Map<string, ComponentProxyClass>
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

export interface ComponentProxyClass {
  new (): ComponentProxy
  template?: string
  includes?: Record<string, ComponentProxyClass>
}

export interface Render {
  (createElement: CreateElement): VNode
}
