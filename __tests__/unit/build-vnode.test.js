const esmImport = require('esm')(module)
const { buildVNode } = esmImport('../../src/build-vnode.js')

test('create div with heading', () => {
  var node = document.createElement('div')
  node.setAttribute('id', 'app')
  node.setAttribute('class', 'small blue')

  var heading = document.createElement('h1')
  heading.setAttribute('class', 'heading')
  node.appendChild(heading)

  var text = document.createTextNode('Hello')
  heading.appendChild(text)

  var vNode = buildVNode(node)

  expect(vNode.tag).toEqual('div')
  expect(vNode.attrs.class).toEqual('small blue')
  expect(vNode.attrs.id).toEqual('app')
  expect(vNode.children[0].attrs.class).toEqual('heading')
  expect(vNode.children[0].children[0].text).toEqual('Hello')
})
