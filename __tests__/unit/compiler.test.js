const esmImport = require('esm')(module)
const { compile } = esmImport('../../src/compiler.js')

// TODO: make sure this works:
/*
<div>
  <div $for="thing in things"></div>
  <div>Another div!</div>
</div>
*/

test('div', () => {
  var vNode = { tag: 'div', children: [] }
  var code = compile(vNode)
  expect(code).toEqual(`with(this){return $('div',{})}`)
})

test('div class="{{color}}"', () => {
  var vNode = {
    tag: 'div',
    attrs: {
      class: '{{color}}'
    },
    children: []
  }
  var code = compile(vNode)
  expect(code).toEqual(`with(this){return $('div',{attrs:{'class':(color)}})}`)
})

test('h1 id="app" custom-attribute="my value"', () => {
  var vNode = {
    tag: 'h1',
    attrs: {
      id: 'app',
      'custom-attribute': 'my value'
    },
    children: []
  }
  var code = compile(vNode)
  expect(code).toEqual(
    `with(this){return $('h1',{attrs:{'id':'app','custom-attribute':'my value'}})}`
  )
})

test('div with child divs', () => {
  var vNode = {
    tag: 'div',
    attrs: [],
    children: [
      {
        tag: 'div',
        attrs: {
          id: 'first'
        },
        children: []
      },
      {
        tag: 'div',
        attrs: {
          id: 'second'
        },
        children: []
      }
    ]
  }
  var code = compile(vNode)
  expect(code).toEqual(
    `with(this){return $('div',{},[$('div',{attrs:{'id':'first'}}),$('div',{attrs:{'id':'second'}})])}`
  )
})

test('div with text inside', () => {
  var vNode = {
    tag: 'div',
    attrs: {},
    children: [
      {
        type: 'text',
        text: 'My text'
      }
    ]
  }
  var code = compile(vNode)
  expect(code).toEqual(`with(this){return $('div',{},['My text'])}`)
})

test('div with $if', () => {
  var vNode = {
    tag: 'div',
    attrs: {},
    renderIf: 'load',
    children: [
      {
        type: 'text',
        attrs: {},
        text: 'Loaded!'
      }
    ]
  }
  var code = compile(vNode)
  expect(code).toEqual(`with(this){return (load) ? $('div',{},['Loaded!']) : ''}`)
})

test('div with expression and hardcoded text', () => {
  var vNode = {
    tag: 'div',
    attrs: {},
    children: [
      {
        type: 'text',
        text: 'Message is: {{msg}}'
      }
    ]
  }
  var code = compile(vNode)
  expect(code).toEqual(`with(this){return $('div',{},['Message is: '+(msg)])}`)
})

test('$for', () => {
  var vNode = {
    tag: 'ul',
    children: [
      {
        tag: 'li',
        renderEach: 'thing in things',
        children: [
          {
            type: 'text',
            text: 'thing {{thing}}'
          }
        ]
      }
    ]
  }
  var code = compile(vNode)
  expect(code).toEqual(
    `with(this){return $('ul',{},[...$li(things,function (thing){return $('li',{},['thing '+(thing)])})])}`
  )
})

test('$for with index', () => {
  var vNode = {
    tag: 'ul',
    children: [
      {
        tag: 'li',
        renderEach: 'thing,i in things',
        children: [
          {
            type: 'text',
            text: 'thing {{thing}}'
          }
        ]
      }
    ]
  }
  var code = compile(vNode)
  expect(code).toEqual(
    `with(this){return $('ul',{},[...$li(things,function (thing,i){return $('li',{},['thing '+(thing)])})])}`
  )
})

test('div with component placeholder', () => {
  var vNode = {
    tag: 'div',
    attrs: {},
    children: [
      {
        tag: 'mycomponent',
        type: 'element',
        attrs: {},
        componentPlaceholder: true,
        cid: 'mycomponent-0',
        children: []
      }
    ]
  }
  var code = compile(vNode)
  expect(code).toEqual(
    `with(this){return $('div',{},[$('mycomponent',{cid:'mycomponent-0',componentPlaceholder:true})])}`
  )
})

test('div with component placeholder with attrs', () => {
  var vNode = {
    tag: 'div',
    attrs: {},
    children: [
      {
        tag: 'mycomponent',
        type: 'element',
        attrs: {
          class: 'large clickable',
          myarg: 'argument value'
        },
        componentPlaceholder: true,
        cid: 'mycomponent-0',
        children: []
      }
    ]
  }
  var code = compile(vNode)
  expect(code).toEqual(
    `with(this){return $('div',{},[$('mycomponent',{attrs:{'class':'large clickable','myarg':'argument value'},cid:'mycomponent-0',componentPlaceholder:true})])}`
  )
})

test('div with events', () => {
  var vNode = {
    tag: 'div',
    attrs: {},
    children: [],
    events: {
      input: 'handleInput'
    }
  }
  var code = compile(vNode)
  expect(code).toEqual(`with(this){return $('div',{events:{'input':handleInput}})}`)
})

test('div with events', () => {
  var vNode = {
    tag: 'div',
    attrs: {},
    children: [],
    events: {
      input: 'handleInput'
    }
  }
  var code = compile(vNode)
  expect(code).toEqual(`with(this){return $('div',{events:{'input':handleInput}})}`)
})
