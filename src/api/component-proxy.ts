import { Component, ComponentClass } from './component.js'
import { CreateElement } from './create-element.js'
import { VNode } from './vnode.js'

export interface InjectedProps {
  props: Record<string, any>
  $element: Element
  $vnode: VNode
  $includes: Map<string, ComponentClass>
  render: Render
  $update: () => void
}

export type ComponentProxy = InjectedProps & Component

export interface Render {
  (createElement: CreateElement): VNode
}
