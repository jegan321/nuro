import { VNode } from '../api/vnode.js'
import { ComponentProxy, ComponentProxyClass } from '../api/component-proxy.js'
import { CreateElement } from '../api/create-element.js'
import { isArray } from '../util/object-utils.js'

export function createElementFactory(includes: Map<string, ComponentProxyClass>): CreateElement {
  return function(
    type: string | (new () => ComponentProxy),
    props: Record<string, any> = {},
    children: (VNode | string)[] | VNode | string = []
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
      if (isVNode(child)) {
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

function isVNode(child: unknown): child is VNode {
  return child != null && (child as VNode).nodeType !== undefined
}
