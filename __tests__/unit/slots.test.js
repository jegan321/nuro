const esmImport = require('esm')(module)
const { addSlotContent } = esmImport('../../src/slots.js')

// TODO: add more tests

test('no children', () => {
  var vChildren = []
  var withSlots = addSlotContent(vChildren)
  expect(withSlots).toEqual([])
})
