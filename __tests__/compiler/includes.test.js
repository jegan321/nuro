let Nuro = require('../../build/dist/nuro.umd.js')
let compileTemplate = Nuro.compileTemplate

test('should compile include', () => {
  let code = compileTemplate('<div><my-component></my-component></div>')
  expect(code)
  .toEqual("with(this){return h('div',{},[h('my-component',{})])}")
})

test('should compile include with attributes and children', () => {
  let code = compileTemplate('<div><my-component foo="foo val"><div>Hello</div></my-component></div>')
  expect(code)
  .toEqual("with(this){return h('div',{},[h('my-component',{'foo':'foo val'},[h('div',{},['Hello'])])])}")
})
