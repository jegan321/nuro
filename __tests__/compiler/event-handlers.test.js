let Nuro = require('../../build/dist/nuro')
let compileTemplate = Nuro.compileTemplate

test('should bind method to event', () => {
  let code = compileTemplate('<div @click="handleClick">Hello</div>')
  expect(code)
  .toEqual("with(this){return h('div',{'@click':handleClick},['Hello'])}")
})

test('should bind anonymous function to event', () => {
  let code = compileTemplate(`<div @click="()=>alert('Hello')">Hello</div>`)
  expect(code)
  .toEqual("with(this){return h('div',{'@click':()=>alert('Hello')},['Hello'])}")
})

test('should bind multi-statement anonymous function to event', () => {
  let code = compileTemplate(`<div @click="()=>{alert('Hello');alert('World');}">Hello</div>`)
  expect(code)
  .toEqual("with(this){return h('div',{'@click':()=>{alert('Hello');alert('World');}},['Hello'])}")
})