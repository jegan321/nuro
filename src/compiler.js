// Input template vNode
// Output render function
export function compile(vNode) {
  let code = 'with(this){return ' + compileNode(vNode) + '}'
  return code
}

function compileNode(vNode) {
  if (vNode.type === 'text') {
    // Replace newline characters with \n to prevent
    // errors when the string is converted into a Function
    let text = vNode.text.replace(/\n/g, '\\n')
    return compileText(text)
  } else {
    // Node is element
    if (vNode.renderIf) {
      return '(' + vNode.renderIf + ') ? ' + compileElement(vNode) + " : ''"
    } else if (vNode.renderEach) {
      return compileRenderEach(vNode)
    } else {
      return compileElement(vNode)
    }
  }
}

// TODO: refactor
function compileElement(vNode) {
  let code = '$('
  code += "'" + vNode.tag + "'"

  // Loop through each attribute and handle expressions in the values
  code += ',{'
  let attrCount = 0
  if (vNode.attrs) {
    let attrs = ''
    for (let [name, value] of Object.entries(vNode.attrs)) {
      if (attrCount === 0) {
        code += 'attrs:{'
      } else {
        attrs += ','
      }
      attrs += "'" + name + "':"
      attrs += compileText(value)
      attrCount++
    }
    if (attrCount !== 0) {
      code += attrs
      code += '}'
    }
  }
  if (vNode.cid) {
    if (attrCount > 0) {
      code += ','
    }
    code += "cid:'" + vNode.cid + "'"
  }
  if (vNode.events) {
    let events = ''
    for (let [name, value] of Object.entries(vNode.events)) {
      let eventCount = 0
      if (eventCount === 0) {
        if (attrCount > 0 || vNode.cid) {
          code += ','
        }
        code += 'events:{'
      } else {
        events += ','
      }
      events += "'" + name + "':"
      events += value
      eventCount++
      if (eventCount !== 0) {
        code += events
        code += '}'
      }
    }
  }
  if (vNode.componentPlaceholder) {
    if (attrCount > 0 || vNode.cid || eventCount > 0) {
      code += ','
    }
    code += 'componentPlaceholder:' + vNode.componentPlaceholder
  }
  code += '}'

  // Children
  if (vNode.children.length) {
    code += ',['
    vNode.children.forEach(function(child, i) {
      code += compileNode(child)
      if (i !== vNode.children.length - 1) {
        code += ','
      }
    })
    code +=']'
  }

  code += ')'
  return code
}

function compileRenderEach(vNode) {
  // TODO: Uses spread operator to turn the array until varargs.
  // TODO: Might want to make this compile to more backwards compatible code
  let code = '...$li('

  let renderEachSplit = vNode.renderEach.trim().split(' in ')
  let renderEachVarName = renderEachSplit[0]
  let renderEachArrayName = renderEachSplit[1]

  vNode.renderEach = false

  code += renderEachArrayName
  code += ',function (' + renderEachVarName + '){'
  code += 'return ' + compileNode(vNode)

  code += '})'
  return code
}

export function compileText(text) {
  // text = text.trim()
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
