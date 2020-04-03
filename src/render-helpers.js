import { getType } from './utils'
import { VNode } from './vnode'

// Called $ in render functions
export function createElement(ctx, tag, options = {}, children) {
  // TODO: remove below code if children must be in array
  let childrenLength = arguments.length - 3
  if (childrenLength > 1) {
    let childArray = []
    for (let i = 0; i < childrenLength; i++) {
      let child = arguments[i + 2]
      if (Array.isArray(child)) {
        childArray = childArray.concat(child)
      } else {
        childArray.push(child)
      }
    }
    children = childArray
  }

  let vNode = new VNode('element')
  vNode.tag = tag
  vNode.cid = options.cid
  vNode.componentPlaceholder = options.componentPlaceholder
  vNode.attrs = options.attrs || {}
  vNode.events = options.events || {}
  vNode.children = []

  vNode.componentDef = ctx.components[tag]

  if (children) {
    if (Array.isArray(children)) {
      vNode.children = children
    } else {
      vNode.children.push(children)
    }
  }

  vNode.children = vNode.children.map(child => {
    // If child is a vNode return it. Else create text node
    if (getType(child) === 'object' && child.isVNode) {
      return child
    } else {
      return new VNode('text', child)
    }
  })

  return vNode
}

// TODO: why does this exist?
// Called $li in render functions
export function createElementList(val, render) {
  let list = []
  if (Array.isArray(val)) {
    for (let i = 0; i < val.length; i++) {
      list.push(render(val[i], i))
    }
  }
  return list
}

// with(this) {
//   return $('div', {attrs:{'id': 'app'}}, $('span', {}, 'zzz'), $('span', {}, 'yyy'))
// }
