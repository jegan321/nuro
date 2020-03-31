/**
 * Utility that return the type of a given object. This is better than
 * doing "typeof obj" because that can return some unexpected results.
 * For example: typeof [] -> object
 * This function uses Object.prototype.toString which is more accurate.
 * The output of toString looks like this: [object Array] but
 * This function will slice out the 'Array' part and return it
 */
export function getType(obj) {
  return Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase()
}

export function clone(obj, encodeHTML) {
  // Get the object type
  let type = getType(obj)

  // If an object, loop through and recursively encode
  if (type === 'object') {
    let cloned = {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = clone(obj[key], encodeHTML)
      }
    }
    return cloned
  }

  // If an array, create a new array and recursively encode
  if (type === 'array') {
    return obj.map(function(item) {
      return clone(item, encodeHTML)
    })
  }

  // If the data is a string, encode it
  if (type === 'string' && encodeHTML) {
    let temp = document.createElement('div')
    temp.textContent = obj
    return temp.innerHTML
  }

  // Otherwise, return object as is
  return obj
}

/**
 * Merges the properties of one object into another
 * @param {Object} object Object to add properties to
 * @param {Object} newProps Object containing the new properties
 * @param {Boolean} deep If true merge recursively for each object property
 */
export function merge(object, newProps, deep) {
  if (newProps) {
    if (getType(newProps) !== 'object') return handleError('newProps must be an object')
    for (let key in newProps) {
      if (newProps.hasOwnProperty(key)) {
        let newProp = newProps[key]
        let oldProp = object[key]
        if (getType(newProp) === 'object' && getType(oldProp) === 'object' && deep) {
          merge(oldProp, newProp, true)
        } else {
          object[key] = newProp
        }
      }
    }
  }
}

export function handleError(msg) {
  throw new Error('Nuro ERROR: ' + msg)
}

export function handleWarning(msg) {
  console.log('Nuro WARNING: ' + msg)
}
