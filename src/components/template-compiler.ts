import { htmlToDom } from '../dom/html-to-dom.js'
import { mapVNode } from '../dom/map-vnode.js'
import { VNode } from '../api/vnode.js'

/**
 * Map of templates and the compiled render method code
 */
const cache = new Map<string, string>()

/**
 * Takes a template string and returns code for a render method. The code will later be turned
 * into a real function using the Function constructor.
 */
export function compileTemplate(template: string): string {
  let cachedCode = cache.get(template)
  if (cachedCode) {
    return cachedCode
  }
  let node = htmlToDom(template)
  let vNode = mapVNode(node)
  let code = 'with(this){return ' + compileNode(vNode) + '}'
  cache.set(template, code)
  return code
}

function compileNode(vNode: VNode): string {
  if (vNode.nodeType === 'text') {
    // Replace newline characters with \n to prevent
    // errors when the string is converted into a Function
    let text = vNode.text.replace(/\n/g, '\\n')
    text = compileText(text)
    return text
  } else {
    // Node is element
    if (vNode.attrs.$if !== undefined) {
      return compileIfDirective(vNode)
    } else if (vNode.attrs.$for !== undefined) {
      return compileForDirective(vNode)
    } else if (vNode.tag === 'slot') {
      return compileSlot()
    } else {
      return compileElement(vNode)
    }
  }
}

function compileElement(vNode: VNode): string {
  // Beginning of createElement call
  let code = 'h('

  // First argument
  code += "'" + vNode.tag + "'"

  // Second argument
  let attributes = []
  for (let [key, value] of Object.entries(vNode.attrs)) {
    if (key.startsWith(':')) {
      // Shorthand attribute binding syntax
      key = key.substr(1)
    } else if (key.startsWith('@')) {
      // Event binding syntax
      // Leave value as is
    } else {
      // Regular attribute
      value = compileText(value)
    }
    key = "'" + key + "'"
    attributes.push(key + ':' + value)
  }
  let joinedAttributes = attributes.join(',')
  code += ',{' + joinedAttributes + '}'

  // Third argument
  if (vNode.children.length > 0) {
    let children: string[] = []
    vNode.children.forEach(vChild => {
      if (vChild.nodeType === 'text' && vChild.text.trim() === '') {
        // Skip blank text nodes
        return
      }
      let childCode = compileNode(vChild)
      children.push(childCode)
    })
    let joinedChildren = children.join(',')
    code += ',[' + joinedChildren + ']'
  }

  // End of createElement call
  code += ')'

  return code
}

function compileIfDirective(vNode: VNode): string {
  let ifValue = vNode.attrs.$if
  delete vNode.attrs.$if

  // Build ternary expression that defaults to empty string
  return `(${ifValue})?${compileElement(vNode)}:''`
}

function compileForDirective(vNode: VNode): string {
  let forValue = vNode.attrs.$for
  delete vNode.attrs.$for

  let forValueSplit = forValue.trim().split(' in ')
  let elementName = forValueSplit[0] // Can include index as well
  let arrayName = forValueSplit[1]

  // Build Array.map() call
  // Use spread operator since this code will be inside of square brackets
  return `...${arrayName}.map((${elementName})=>${compileNode(vNode)})`
}

function compileSlot(): string {
  return '...props.children'
}

function compileText(text: string) {
  if (text.length < 5) {
    return "'" + text + "'"
  }
  let inExpression = false
  let expression = ''
  let output = ''
  if (text.charAt(0) !== '{' || text.charAt(1) !== '{') {
    output += "'"
  }
  let char, nextChar
  for (let i = 0; i < text.length; i++) {
    char = text.charAt(i)
    nextChar = text.length > i ? text.charAt(i + 1) : false
    if (char === '{' && nextChar && nextChar === '{') {
      if (i !== 0) {
        output += "'+"
      }
      output += '('
      i++ // Skip second bracket
      inExpression = true
    } else if (char === '}') {
      i++ // Skip second bracket
      output += expression + ')'
      inExpression = false
      expression = ''
      if (i !== text.length - 1) {
        output += "+'"
      }
    } else if (inExpression) {
      expression += char
    } else {
      output += char
    }
  }
  if (char !== "'" && char !== '}') {
    output += "'"
  }
  return output
}
