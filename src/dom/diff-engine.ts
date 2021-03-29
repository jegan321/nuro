import { VNode } from '../api/vnode.js'
import { zip } from '../util/object-utils.js'
import { NuroError } from '../util/nuro-error.js'
import { DomPatcher } from './dom-patcher.js'

interface PatchFunction {
  (node: Element): Element | void
}

export class DiffEngine {
  private domPatcher: DomPatcher

  constructor(domPatcher: DomPatcher) {
    this.domPatcher = domPatcher
  }

  reconcile(element: Element, vOldNode: VNode, vNewNode: VNode): Element {
    let patch = this.createPatchFunction(vOldNode, vNewNode)
    let newElement = patch(element)
    if (newElement) {
      return newElement
    } else {
      throw new NuroError('Patch function did not return an element')
    }
  }

  createPatchFunction(vOldNode: VNode, vNewNode: VNode): PatchFunction {
    return this.diffNodes(vOldNode, vNewNode)
  }

  private diffNodes(vOldNode: VNode, vNewNode?: VNode): PatchFunction {
    if (!vNewNode) {
      return node => this.domPatcher.removeNode(node)
    }

    // If one node is text and the texts don't match or one is not text
    if (
      (vOldNode.nodeType === 'text' || vNewNode.nodeType === 'text') &&
      (vNewNode.text !== vOldNode.text ||
        vOldNode.nodeType !== 'text' ||
        vNewNode.nodeType !== 'text')
    ) {
      return node => this.domPatcher.replaceNode(node, vNewNode)
    }

    if (vNewNode.nodeType === 'component') {
      if (vOldNode.componentClass !== vNewNode.componentClass) {
        // Component is replacing non-component or replacing different component
        return node => this.domPatcher.mountComponentOnNode(node, vOldNode, vNewNode)
      } else {
        // Same component already exists here so update props
        return node => this.domPatcher.setComponentPropsOnNode(node, vNewNode.attrs)
      }
    }

    if (vOldNode.tag !== vNewNode.tag) {
      // New node is not component

      return node => {
        if (vOldNode.nodeType === 'component') {
          // Non-component is replacing component so unmount old component
          this.domPatcher.unmountComponentOnNode(node)
        }
        return this.domPatcher.replaceNode(node, vNewNode)
      }
    }

    let patchAttrs = this.diffAttributes(vOldNode.attrs, vNewNode.attrs)
    const patchChildren = this.diffChildren(vOldNode.children, vNewNode.children)

    return node => {
      patchAttrs(node)
      patchChildren(node)
      return node
    }
  }

  private diffAttributes(
    vOldAttrs: Record<string, any>,
    vNewAttrs: Record<string, any>
  ): PatchFunction {
    let patches: PatchFunction[] = []

    // set new attributes
    for (const [vNewAttrName, vNewAttrValue] of Object.entries(vNewAttrs)) {
      patches.push(node => {
        this.domPatcher.setAttribute(node, vNewAttrName, vNewAttrValue)
        return node
      })
    }

    // remove old attributes
    for (const vOldAttrName in vOldAttrs) {
      // If an old attribute doesn't exist in the new vNode
      // OR the old attribute is now undefined or null, remove it
      if (!(vOldAttrName in vNewAttrs) || vNewAttrs[vOldAttrName] == null) {
        patches.push(node => {
          this.domPatcher.removeAttribute(node, vOldAttrName)
          return node
        })
      }
    }

    return node => {
      for (const patch of patches) {
        patch(node)
      }
      return node
    }
  }

  private diffChildren(vOldChildren: VNode[] = [], vNewChildren: VNode[] = []): PatchFunction {
    const childPatches: PatchFunction[] = []

    vOldChildren.forEach((vOldChild, i) => {
      childPatches.push(this.diffNodes(vOldChild, vNewChildren[i]))
    })

    const additionalPatches: PatchFunction[] = []
    for (const additionalVChild of vNewChildren.slice(vOldChildren.length)) {
      additionalPatches.push(parent => this.domPatcher.appendChildNode(parent, additionalVChild))
    }

    return parent => {
      if (childPatches.length !== parent.childNodes.length) {
        throw new NuroError('Actual child nodes in DOM does not match number of child patches')
      }

      let patchChildNodesPairs = zip(childPatches, parent.childNodes)
      for (const pair of patchChildNodesPairs) {
        const patch = pair.left
        const child = pair.right
        patch(child as Element)
      }

      for (const patch of additionalPatches) {
        patch(parent)
      }

      return parent
    }
  }
}
