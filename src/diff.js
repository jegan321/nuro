
export function diff(vOldRootNode, vNewRootNode, buildComponent) {
  return diffNodes(vOldRootNode, vNewRootNode)

  // Compares two virtual nodes and returns a patch function. That patch
  // can be applied to the actual DOM node to make the required updates
  function diffNodes(vOldNode, vNewNode) {
    if (!vNewNode) {
      return node => {
        node.remove()
      }
    }

    if (!vOldNode) {
      return node => {
        node.appendChild(createNode(vNewNode))
        return node
      }
    }

    if (vOldNode.type === 'text' || vNewNode.type === 'text') {
      if (vNewNode.text !== vOldNode.text) {
        return node => {
          let newNode = createNode(vNewNode)
          node.replaceWith(newNode)
          return newNode
        }
      }
    }

    if (vOldNode.tag !== vNewNode.tag) {
      // console.log('tags dont match');
      return node => {
        let componentInstance
        if (node._nuro && node._nuro.componentName === vNewNode.tag) {
          componentInstance = node._nuro.componentInstance
        }
        let newNode = createNode(vNewNode, undefined, componentInstance)
        node.replaceWith(newNode)
        return newNode
      }
    }

    let patchAttrs = diffAttributes(vOldNode.attrs, vNewNode.attrs)
    const patchChildren = diffChildren(vOldNode.children, vNewNode.children)
    const patchEvents = diffEvents(vOldNode.events, vNewNode.events)

    return node => {
      setCid(node, vNewNode.cid)
      patchAttrs(node)
      patchChildren(node)
      patchEvents(node)
      return node
    }
  }

  function createNode(vNode, isSVG, componentInstance) {
    let node
    isSVG = isSVG || vNode.tag === 'svg'
    if (vNode.type === 'text') {
      node = document.createTextNode(vNode.text)
    } else if (isSVG) {
      node = document.createElementNS('http://www.w3.org/2000/svg', vNode.tag)
    } else {
      node = document.createElement(vNode.tag)
    }

    if (vNode.attrs) {
      for (let [name, value] of Object.entries(vNode.attrs)) {
        setAttribute(node, name, value)
      }
    }

    if (vNode.events) {
      for (let [name, value] of Object.entries(vNode.events)) {
        setEvent(node, name, value)
      }
    }

    setCid(node, vNode.cid)

    if (vNode.componentDef) {
      // let component = componentRepository.getInstance(vNode.cid, vNode.attrs)
      // return component.mount(node, vNode.attrs, vNode.children)

      if (!componentInstance) {
        componentInstance = buildComponent(vNode.tag, vNode.componentDef, 'cid', vNode.attrs)
      }
      // if (node._nuro && node._nuro.componentName === vNode.tag) {
      // if (component) {
      //   console.log('Found comp ' + node._nuro.componentName);
      //   component = node._nuro.componentInstance
      // } else {
      //   component = buildComponent(vNode.componentDef, 'cid', vNode.attrs)
      // }

      return componentInstance.mount(node, vNode.attrs, vNode.children)
    }

    // If the element has child nodes, create them
    if (vNode.children) {
      vNode.children.forEach(function(vNodeChild) {
        node.appendChild(createNode(vNodeChild, isSVG))
      })
    }

    return node
  }

  function diffAttributes(vOldAttrs = [], vNewAttrs = []) {
    let patches = []

    // set new attributes
    for (const [k, v] of Object.entries(vNewAttrs)) {
      patches.push(node => {
        setAttribute(node, k, v)
      })
    }

    // remove old attributes
    for (const vOldAttr in vOldAttrs) {
      // If an old attribute doesn't exist in the new vNode
      // OR the old attribute is now undefined or null, remove it
      if (!(vOldAttr in vNewAttrs) || vNewAttrs[vOldAttr] == null) {
        patches.push(node => {
          node.removeAttribute(vOldAttr)
        })
      }
    }

    return node => {
      for (const patch of patches) {
        patch(node)
      }
    }
  }

  // Sets the attribute on the node and sometimes sets the property on the node with
  // the same name.
  function setAttribute(node, attrName, attrValue) {
    // TODO: change this to set any value that is a property on the node?
    if (attrName === 'checked' || 'selected') {
      // If value is empty string or a truthy value, set property
      // to true
      node[attrName] = attrValue === '' ? true : attrValue
    }

    // If value is undefined or null, don't add attribute to the DOM
    if (attrValue != null) {
      node.setAttribute(attrName, attrValue)
    }
  }

  function diffChildren(vOldChildren = [], vNewChildren = []) {
    const childPatches = []
    vOldChildren.forEach((vOldChild, i) => {
      childPatches.push(diffNodes(vOldChild, vNewChildren[i]))
    })

    const additionalPatches = []
    for (const additionalVChild of vNewChildren.slice(vOldChildren.length)) {
      additionalPatches.push(diffNodes(null, additionalVChild))
    }

    return parent => {
      for (const [patch, child] of zip(childPatches, parent.childNodes)) {
        patch(child)
      }

      for (const patch of additionalPatches) {
        patch(parent)
      }
    }
  }

  function diffEvents(vOldEvents = [], vNewEvents = []) {
    let patches = []

    // set new events
    for (const [k, v] of Object.entries(vNewEvents)) {
      patches.push(node => {
        setEvent(node, k, v)
      })
    }

    // remove old events
    for (const vOldEvent in vOldEvents) {
      // If an old event doesn't exist in the new vNode
      // OR the old event is now undefined or null, remove it
      if (!(vOldEvent in vNewEvents) || vNewEvents[vOldEvent] == null) {
        patches.push(node => {
          removeEvent(node, vOldEvent)
        })
      }
    }

    return node => {
      for (const patch of patches) {
        patch(node)
      }
    }
  }

  function setComponent(node, name, instance) {
    if (!node._nuro) {
      node._nuro = {}
    }
    node._nuro.componentName = name
    node._nuro.componentInstance = instance
  }

  // TODO: remove this stuff...?
  function setCid(node, cid) {
    if (!node._nuro) {
      node._nuro = {}
    }
    node._nuro.cid = cid
  }

  function setEvent(node, eventName, eventValue) {
    if (!node._nuro) {
      node._nuro = {
        events: {}
      }
    }
    node._nuro.events[eventName] = eventValue
  }

  function removeEvent(node, eventName) {
    if (node._nuro) {
      delete node._nuro.events[eventName]
    }
  }

  /**
   * Creates a new array made up of pairs. Each pair is the element from each
   * array at that index.
   *
   * For example, index 1 is xs[1] and ys[1], index 2 is xs[2] and ys[2], etc.
   *
   * If they have different lengths, the new array will
   * be the length of the shortest one.
   */
  function zip(xs, ys) {
    const zipped = []
    for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
      zipped.push([xs[i], ys[i]])
    }
    return zipped
  }
}
