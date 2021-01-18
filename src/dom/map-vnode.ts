import { VNode } from '../api/vnode'

/**
 * Builds a VNode instance based on a given Element
 * @param {Node} rootNode
 */
export function mapVNode(rootNode: Element): VNode {
  return createVNode(rootNode)
}

function createVNode(node: Element): VNode {
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
    vNode.children = createChildren(node.childNodes)
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

function createChildren(children: NodeListOf<ChildNode>): VNode[] {
  let vChildren: VNode[] = []
  Array.prototype.forEach.call(children, function(child) {
    let vNode = createVNode(child)
    vChildren.push(vNode)
  })
  return vChildren
}
