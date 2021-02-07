import { ComponentClass } from '../api/component.js'
import { CreateElement } from '../api/create-element.js'
import { VNode } from '../api/vnode.js'

// TODO: move this to components folder since it is not part of public API

export interface ComponentProxy {
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

export interface Render {
  (createElement: CreateElement): VNode
}
