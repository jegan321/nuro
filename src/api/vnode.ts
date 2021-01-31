import { Component } from './component.js'

export interface VNode {
  nodeType: 'component' | 'element' | 'text' | 'comment'
  tag: string
  text: string
  attrs: Record<string, any>
  children: VNode[]
  componentClass?: new () => Component
}
