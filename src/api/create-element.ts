import { Component } from './component.js';
import { VNode } from './vnode.js'

export interface CreateElement {
  (type: string | (new (props: any) => Component), props?: Record<string, any>, children?: (VNode | string)[] | VNode | string): VNode
}
