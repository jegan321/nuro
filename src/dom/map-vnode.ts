import { VNode } from '../api/vnode.js'

/**
 * Builds a VNode instance based on a given Element
 * @param {Node} rootNode
 */
export function mapVNode(rootNode: Element, includeComments: boolean = true): VNode {
  return createVNode(rootNode, includeComments)
}

function createVNode(node: Element, includeComments: boolean): VNode {
  if (node.nodeType === 1) {
    // Node is an element
    let vNode: VNode = {
      nodeType: 'element',
      tag: node.tagName.toLowerCase(),
      text: '',
      attrs: {},
      children: []
    }
    Array.prototype.forEach.call(node.attributes, attr => {
      vNode.attrs[attr.name] = attr.value
    })
    vNode.children = createChildren(node.childNodes, includeComments)
    return vNode
  } else {
    // Node is text or comment
    return {
      nodeType: node.nodeType === 8 ? 'comment' : 'text',
      text: node.textContent || '',
      tag: '',
      attrs: {},
      children: []
    }
  }
}

function createChildren(children: NodeListOf<ChildNode>, includeComments: boolean): VNode[] {
  let vChildren: VNode[] = []
  Array.prototype.forEach.call(children, child => {
    if (includeComments || child.nodeType !== 8) {
      let vNode = createVNode(child, includeComments)
      vChildren.push(vNode)
    }
  })
  return vChildren
}
