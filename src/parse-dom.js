import { handleWarning } from './utils'

/**
 * Checks if the client supports DOMParser. The function runs immediately and
 * saves the results as a boolean in supportsDomParser
 */
let supportsDomParser = (function() {
  if (window.DOMParser) {
    let domParser = new DOMParser()
    try {
      domParser.parseFromString('x', 'text/html')
      return true
    } catch (err) {
      // Error means no support
    }
  }
  handleWarning(
    'DOMParser is not supported in this browser. Using document.createElement() instead.'
  )
  return false
})()

/**
 * Convert a string representing one DOM node and turns
 * it into a real DOM node. Tries to use DOMParser() if supported, otherwise uses
 * document.createElement(). DOMParser is better because it doesn't cause
 * img tags to try to download the src content
 */
export function parseDomNode(str) {
  let wrapperNode

  // If DOMParser is supported, use it
  if (supportsDomParser) {
    let parser = new DOMParser()
    let doc = parser.parseFromString(str, 'text/html')
    wrapperNode = doc.body
  } else {
    // Otherwise, fallback to old-school method
    let dom = document.createElement('div')
    dom.innerHTML = str
    wrapperNode = dom
  }

  return wrapperNode.childNodes[0]
}
