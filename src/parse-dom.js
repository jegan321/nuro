/**
 * Convert a string representing one DOM node and turns
 * it into a real DOM node.
 */
export function parseDomNode(str) {
  let doc = new DOMParser().parseFromString(str, 'text/html')
  let wrapperNode = doc.body
  return wrapperNode.childNodes[0]
}
