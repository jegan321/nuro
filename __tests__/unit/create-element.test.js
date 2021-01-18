const esmImport = require('esm')(module)
const { createElementFactory } = esmImport('../../build/compiled/components/create-element.js')

// TODO: add test for createElement with includes map

test('should create a VNode object', () => {
  const createElement = createElementFactory(new Map())
  let vnode = createElement('div', {id: 'my-element', class: 'my-class'}, ['Foo'])
  expect(vnode.nodeType).toEqual('element')
  expect(vnode.tag).toEqual('div')
  expect(vnode.attrs.id).toEqual('my-element')
  expect(vnode.attrs.class).toEqual('my-class')
  expect(vnode.children[0].text).toEqual('Foo')
})

test('when give children as a scalar, should create a VNode object', () => {
  const createElement = createElementFactory(new Map())
  let vnode = createElement('div', {id: 'my-element', class: 'my-class'}, 'Foo')
  expect(vnode.nodeType).toEqual('element')
  expect(vnode.tag).toEqual('div')
  expect(vnode.attrs.id).toEqual('my-element')
  expect(vnode.attrs.class).toEqual('my-class')
  expect(vnode.children[0].text).toEqual('Foo')
})