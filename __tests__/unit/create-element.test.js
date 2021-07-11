const esmImport = require('esm')(module)
const { createElementFactory } = esmImport('../../compiled/components/create-element.js')

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

test('when given Map of includes, should be able to use them in function', () => {
  let includes = new Map()
  class MyButton {
    template = '<button>My Button</button>'
  }
  includes.set('my-button', MyButton)
  const createElement = createElementFactory(includes)
  let vnode = createElement('div', {id: 'my-element', class: 'my-class'}, [
    createElement('my-button')
  ])
  expect(vnode.nodeType).toEqual('element')
  expect(vnode.tag).toEqual('div')
  expect(vnode.attrs.id).toEqual('my-element')
  expect(vnode.attrs.class).toEqual('my-class')
  expect(vnode.children[0].componentClass).toEqual(MyButton)
})