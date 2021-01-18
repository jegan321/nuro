import { VNode } from '../api/vnode'
import { Component, ComponentClass } from '../api/component'
import { isArray } from '../util/object-utils'
import { NuroError } from '../util/nuro-error'
import { CreateElement } from '../api/create-element'

export function createElementFactory(includes: Map<string, ComponentClass>): CreateElement {
  return function(
    type: string | (new () => Component),
    props: Record<string, any> = {},
    children: (VNode | any)[] = []
  ): VNode {
    if (!isArray(children)) {
      children = [children]
    }

    let nodeType: 'component' | 'element'
    let tag
    let componentClass

    if (typeof type == 'function') {
      // First argument is a component class
      nodeType = 'component'
      tag = ''
      componentClass = type
    } else if (includes.has(type)) {
      // First argument is the name of a component in the includes map
      nodeType = 'component'
      tag = ''
      componentClass = includes.get(type)
    } else {
      // First argument is a regular element tag
      nodeType = 'element'
      tag = type
    }
    let vNode: VNode = {
      nodeType: nodeType,
      tag: tag,
      text: '',
      attrs: props,
      children: [],
      componentClass: componentClass
    }
    vNode.children = children.map(child => {
      if (child != null && child.nodeType) {
        // Child is VNode
        return child
      } else {
        return {
          nodeType: 'text',
          tag: '',
          text: child,
          attrs: {},
          children: []
        }
      }
    })
    return vNode
  }
}
