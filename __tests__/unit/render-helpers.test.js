const esmImport = require('esm')(module)
const { createElement, createElementList} = esmImport('../../src/render-helpers.js')

const $ = function (tag, options, children) {
  let ctx = {
    components: {}
  }
  return createElement(ctx, tag, options, children)
}
const $li = function (val, render) {
  return createElementList(val, render)
}

test('div', () => {
  var output = $('div')
  expect(output).toMatchObject({
    type: 'element',
    tag: 'div',
    attrs: {},
    children: []
  })
})

test('div {}', () => {
  var output = $('div', {})
  expect(output).toMatchObject({
    type: 'element',
    tag: 'div',
    attrs: {},
    children: []
  })
})

test('div {id: "123"}', () => {
  var output = $('div', { attrs: { id: '123' } })
  expect(output).toMatchObject({
    type: 'element',
    tag: 'div',
    attrs: { id: '123' },
    children: []
  })
})

test('div {id: "123"} "hello"', () => {
  var output = $('div', { attrs: { id: '123' } }, 'hello')
  expect(output).toMatchObject({
    type: 'element',
    tag: 'div',
    attrs: { id: '123' },
    children: [{ type: 'text', text: 'hello' }]
  })
})

// test('div {id: "123"} "hello" "world"', () => {
//   var output = $('div', { attrs: { id: '123' } }, 'hello', 'world')
//   expect(output).toMatchObject({
//     type: 'element',
//     tag: 'div',
//     attrs: { id: '123' },
//     children: [
//       { type: 'text', text: 'hello' },
//       { type: 'text', text: 'world' }
//     ]
//   })
// })

// test('div {id: "123"} "h1" "h2"', () => {
//   var output = $('div', { attrs: { id: '123' } }, $('h1'), $('h2'))
//   expect(output).toMatchObject({
//     type: 'element',
//     tag: 'div',
//     attrs: { id: '123' },
//     children: [
//       { type: 'element', tag: 'h1', attrs: {}, children: [] },
//       { type: 'element', tag: 'h2', attrs: {}, children: [] }
//     ]
//   })
// })

test('div {id: "123"} ["hello" "world"]', () => {
  var output = $('div', { attrs: { id: '123' } }, ['hello', 'world'])
  expect(output).toMatchObject({
    type: 'element',
    tag: 'div',
    attrs: { id: '123' },
    children: [
      { type: 'text', text: 'hello' },
      { type: 'text', text: 'world' }
    ]
  })
})

test('div {id: "123"} [h1 h2]', () => {
  var output = $('div', { attrs: { id: '123' } }, [$('h1'), $('h2')])
  expect(output).toMatchObject({
    type: 'element',
    tag: 'div',
    attrs: { id: '123' },
    children: [
      { type: 'element', tag: 'h1', attrs: {}, children: [] },
      { type: 'element', tag: 'h2', attrs: {}, children: [] }
    ]
  })
})

test('div [h1 h2] with text', () => {
  var output = $('div', {}, [$('h1', {}, 'heading'), $('h2', {}, 'subheading')])
  expect(output).toMatchObject({
    type: 'element',
    tag: 'div',
    attrs: {},
    children: [
      {
        type: 'element',
        tag: 'h1',
        attrs: {},
        children: [{ type: 'text', text: 'heading' }]
      },
      {
        type: 'element',
        tag: 'h2',
        attrs: {},
        children: [{ type: 'text', text: 'subheading' }]
      }
    ]
  })
})

test('ul with $li', () => {
  var things = ['one', 'two', 'three']
  var output = $(
    'ul',
    {},
    $li(things, t => $('li', {}, 'thing ' + t))
  )
  expect(output).toMatchObject({
    type: 'element',
    tag: 'ul',
    attrs: {},
    children: [
      {
        type: 'element',
        tag: 'li',
        attrs: {},
        children: [{ type: 'text', text: 'thing one' }]
      },
      {
        type: 'element',
        tag: 'li',
        attrs: {},
        children: [{ type: 'text', text: 'thing two' }]
      },
      {
        type: 'element',
        tag: 'li',
        attrs: {},
        children: [{ type: 'text', text: 'thing three' }]
      }
    ]
  })
})

// TODO: toMatchObject is failing, just assert each property instead
// test('div with h1 and multple spans', () => {
//   var title = 'Hello'
//   var items = ['first', 'second', 'third']

//   var output = $(
//     'div',
//     {},
//     $('h1', {}, title),
//     $li(items, function(i) {
//       return $('span', {}, i)
//     })
//   )
//   expect(output).toMatchObject({
//     type: 'element',
//     tag: 'div',
//     attrs: {},
//     children: [
//       {
//         type: 'element',
//         tag: 'h1',
//         attrs: {},
//         children: [{ type: 'text', text: 'Hello' }]
//       },
//       {
//         type: 'element',
//         tag: 'span',
//         attrs: {},
//         children: [{ type: 'text', text: 'first' }]
//       },
//       {
//         type: 'element',
//         tag: 'span',
//         attrs: {},
//         children: [{ type: 'text', text: 'second' }]
//       },
//       {
//         type: 'element',
//         tag: 'span',
//         attrs: {},
//         children: [{ type: 'text', text: 'third' }]
//       }
//     ]
//   })
// })
