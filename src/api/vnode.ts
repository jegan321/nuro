import { ComponentProxy } from './component-proxy.js'

export interface VNode {
  nodeType: 'component' | 'element' | 'text' | 'comment'
  tag: string
  text: string
  attrs: Record<string, any>
  children: VNode[]
  componentClass?: new () => ComponentProxy
}
