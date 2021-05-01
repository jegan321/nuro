let Nuro = require('../../build/dist/nuro.umd.js')
let compileTemplate = Nuro.compileTemplate

test('should compile slot', () => {
  let code = compileTemplate('<div><h1>Hello</h1><slot></slot></div>')
  expect(code)
  .toEqual("with(this){return h('div',{},[h('h1',{},['Hello']),...props.children])}")
})