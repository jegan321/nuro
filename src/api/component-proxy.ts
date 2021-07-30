import { Component, ComponentClass, Render } from './component.js'
import { VNode } from './vnode.js'

export interface InjectedProps {
  props: Record<string, any>
  $element: Element
  $vnode: VNode
  includes: Map<string, ComponentClass>
  render: Render
  $update: (newData?: Record<string, any>) => void
}

export type ComponentProxy = InjectedProps & Component
