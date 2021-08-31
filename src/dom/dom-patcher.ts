import { mapVNode } from './map-vnode.js'
import { hasComponentProxy, removeEventHandler, setEventHandler } from './node-context.js'
import { NuroError } from '../util/nuro-error.js'
import { isFunction } from '../util/object-utils.js'
import { VNode } from '../api/vnode.js'
import { ComponentClass } from '../api/component.js'

interface MountFunction {
  (
    ComponentClass: ComponentClass,
    node: Element,
    props: Record<string, any>,
    children: VNode[],
    vOldNode: VNode
  ): Element
}

interface UnmountFunction {
  (element: Element): boolean
}

interface SetPropsFunction {
  (node: Element, props: Record<string, any>): Element
}

export class DomPatcher {
  private mountComponent: MountFunction
  private unmountComponent: UnmountFunction
  private setProps: SetPropsFunction

  constructor(
    mountComponent: MountFunction,
    unmountComponent: UnmountFunction,
    setProps: SetPropsFunction
  ) {
    this.mountComponent = mountComponent
    this.unmountComponent = unmountComponent
    this.setProps = setProps
  }

  removeNode(node: Element): void {
    node.remove()
  }

  replaceNode(node: Element, vNewNode: VNode): Element {
    let newNode = this.createNode(vNewNode)
    this.unmountComponent(node)
    node.replaceWith(newNode)
    return newNode
  }

  appendChildNode(node: Element, vChildNode: VNode): Element {
    node.appendChild(this.createNode(vChildNode))
    return node
  }

  mountComponentOnNode(node: Element, vOldNode: VNode, vNewNode: VNode): Element {
    if (vNewNode.componentClass) {
      this.unmountComponent(node)
      return this.mountComponent(
        vNewNode.componentClass,
        node,
        vNewNode.attrs,
        vNewNode.children,
        vOldNode
      )
    } else {
      throw new NuroError('Component class is required for component node type')
    }
  }

  setComponentPropsOnNode(node: Element, props: Record<string, any>): Element {
    return this.setProps(node, props)
  }

  unmountComponentOnNode(node: Element): void {
    this.unmountComponent(node)
  }

  private createNode(vNode: VNode, isSVG: boolean = false): Element {
    let node: any
    isSVG = isSVG || vNode.tag === 'svg'
    if (vNode.nodeType === 'component') {
      if (vNode.componentClass) {
        let tempDiv = document.createElement('div')
        let vOldNode = mapVNode(tempDiv)
        node = this.mountComponent(
          vNode.componentClass,
          tempDiv,
          vNode.attrs,
          vNode.children,
          vOldNode
        )
      } else {
        throw new NuroError('Component class is required for component node type')
      }
    } else if (vNode.nodeType === 'text') {
      node = document.createTextNode(vNode.text)
    } else if (isSVG) {
      node = document.createElementNS('http://www.w3.org/2000/svg', vNode.tag)
    } else {
      node = document.createElement(vNode.tag)
    }

    if (vNode.nodeType !== 'component') {
      for (let [name, value] of Object.entries(vNode.attrs)) {
        this.setAttribute(node, name, value)
      }

      vNode.children.forEach(vNodeChild => {
        let createdNode = this.createNode(vNodeChild, isSVG)
        node.appendChild(createdNode)
      })
    }

    return node
  }

  // Sets the attribute on the node and sometimes sets the property on the node with
  // the same name.
  setAttribute(node: Element, attrName: string, attrValue: any): void {
    if (attrName === 'checked') {
      let inputNode = node as HTMLInputElement
      inputNode.checked = !!attrValue
    }

    if (attrValue != null) {
      if (attrName.startsWith('@')) {
        if (isFunction(attrValue)) {
          setEventHandler(node, attrName.substring(1), attrValue)
        } else {
          throw new NuroError('Event handler must be a function')
        }
      } else if (node.getAttribute(attrName) !== attrValue) {
        node.setAttribute(attrName, attrValue)
      }
    }
  }

  removeAttribute(node: Element, attrName: string): void {
    if (attrName.startsWith('@')) {
      removeEventHandler(node, attrName.substring(1))
    } else {
      node.removeAttribute(attrName)
    }
  }

  createElementInBody(tagName: string): Element {
    let element = document.createElement(tagName)
    document.body.appendChild(element)
    return element
  }
}
