import { VNode } from './vnode'

export interface CreateElement {
  (type: string, props?: Record<string, any>, children?: VNode[]): VNode
}
