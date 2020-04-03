import { VNode } from './vnode'

/**
 * Builds a VNode instance based on a given real DOM node
 * @param {Node} rootNode
 */
export function buildVNode(rootNode) {
  return createVNode(rootNode)
}

function createVNode(node) {
  let vNode

  if (node.nodeType === 1) {
    // Node is an element

    let renderEach = node.getAttribute('$for')
    let renderIf = node.getAttribute('$if')

    // Remove directives so they aren't rendered to the DOM
    node.removeAttribute('$for')
    node.removeAttribute('$if')

    // $src attribute can be used to prevent images from downloading
    // when the template DOM is rendered by the browser
    let renderSrcValue = node.getAttribute('$src')
    if (renderSrcValue) {
      node.removeAttribute('$src')
      node.setAttribute('src', renderSrcValue)
    }

    vNode = new VNode('element')
    // vNode.cid = ctx.cid
    vNode.tag = node.tagName.toLowerCase().replace('-', '')
    vNode.renderEach = renderEach
    vNode.renderIf = renderIf

    // // Check if a child component exists with this name
    // if (ctx.components) {
    //   let componentDef = ctx.components[vNode.tag]
    //   if (componentDef) {
    //     let childCid = componentRepository.addInstance(vNode.tag, componentDef)
    //     vNode.cid = childCid
    //     vNode.componentPlaceholder = true
    //   }
    // }

    vNode.attrs = {}
    vNode.events = {}
    Array.prototype.forEach.call(node.attributes, attr => {
      if (attr.name.charAt(0) === '@') {
        // event handler
        let eventType = attr.name.substring(1, attr.name.length)
        let methodName = attr.value
        vNode.events[eventType] = methodName
      } else if (attr.name.charAt(0) === ':') {
        // one-way binding shorthand syntax
        let attrToBind = attr.name.substring(1, attr.name.length)
        let expression = attr.value
        vNode.attrs[attrToBind] = '{{' + expression + '}}'
      } else {
        // normal attribute
        vNode.attrs[attr.name] = attr.value
      }
    })

    vNode.children = createChildren(node.childNodes)
  } else {
    // Node is text or comment
    vNode = new VNode(node.nodeType === 8 ? 'comment' : 'text', node.textContent)
  }

  return vNode
}

function createChildren(children) {
  let vChildren = []
  Array.prototype.forEach.call(children, function(child) {
    let vNode = createVNode(child)
    // Skip comments when creating virtual DOM
    if (vNode.type === 'comment') {
      return
    }
    vChildren.push(vNode)
  })
  return vChildren
}
