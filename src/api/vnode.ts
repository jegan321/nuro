import { ComponentProxy } from './component-proxy.js'
import { ComponentClass } from './component.js'

export interface VNode {
  nodeType: 'component' | 'element' | 'text' | 'comment'
  tag: string
  text: string
  attrs: Record<string, any>
  children: VNode[]
  componentClass?: ComponentClass
}
