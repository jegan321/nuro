/**
 * Takes child VNodes and updates them with slot content
 * @param {Array} vChildren children of a component
 * @param {Array} slotContent slot content that was passed from the parent template
 */
export function addSlotContent(vChildren, slotContent = []) {
  let newVChildren = []

  let namedSlots = mapNamedSlots(slotContent)

  // Loop through each child and replace slots
  for (let i = 0; i < vChildren.length; i++) {
    let vChild = vChildren[i]
    if (vChild.tag === 'slot') {
      let slotName = vChild.attrs.name
      if (slotName === 'default' || !slotName) {
        // default slot
        let defaultContent = slotContent.filter(el => !el.attrs || !el.attrs['$slot'])
        newVChildren.push(...defaultContent)
      } else if (slotName) {
        // named slot
        let namedSlotContent = namedSlots[slotName]
        if (namedSlotContent) {
          newVChildren.push(namedSlotContent)
        } else {
          // This means there was a named slot but no slot content
          // provided as an argument
          handleError('Unable to find content for named slot: ' + slotName)
        }
      }
    } else {
      // If the child is not a slot just keep it as is
      newVChildren.push(vChild)
    }
  }

  // Remove the $slot attribute from each node so it does render to the DOM
  newVChildren.forEach(newVChild => {
    if (newVChild.attrs) {
      delete newVChild.attrs['$slot']
    }
  })

  return newVChildren
}

/**
 * Takes an array of slot content nodes and returns a map with each
 * node that has a name
 * @param {Array} slotContent
 */
function mapNamedSlots(slotContent) {
  let namedSlots = {}
  for (let i = 0; i < slotContent.length; i++) {
    let slotContentNode = slotContent[i]
    if (slotContentNode.attrs) {
      let renderSlotValue = slotContentNode.attrs['$slot']
      if (renderSlotValue) {
        namedSlots[renderSlotValue] = slotContentNode
      }
    }
  }
  return namedSlots
}
