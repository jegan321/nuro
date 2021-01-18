/**
 * Convert a HTML string representing one DOM node and turns
 * it into a real DOM node.
 */
export function htmlToDom(html: string): Element {
  let document = new DOMParser().parseFromString(html, 'text/html')
  let wrapperNode = document.body
  return wrapperNode.children[0]
}
