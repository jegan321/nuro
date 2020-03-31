/**
 * Data structure that represents a DOM Node. It contains only the
 * minimum data necessary to compile to a render function and support
 * diffing.
 *
 * Properties
 * isVNode:    flag for checking if object is an instance of VNode
 * type:       element, text or comment
 * tag:        the tagName if it's an element
 * renderEach: expression in the $for directive
 * renderIf:   expression in the $if directive
 * text:       the textContent if it's a text or comment
 * attrs:      element attributes
 * children:   child nodes as VNode objects
 */
export class VNode {
  constructor(type, text) {
    this.isVNode = true
    this.type = type
    if (text !== undefined) {
      this.text = text
    }
  }
}
