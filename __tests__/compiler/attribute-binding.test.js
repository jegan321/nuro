let Nuro = require('../../dist/nuro.umd.js')
let compileTemplate = Nuro.compileTemplate

test('should bind class attribute', () => {
  let code = compileTemplate('<div :class="foo">Hello</div>')
  expect(code)
  .toEqual("with(this){return h('div',{'class':foo},['Hello'])}")
})

test('should bind several attributes', () => {
  let code = compileTemplate('<div :id="id" :class="class" :data-foo="foo">Hello</div>')
  expect(code)
  .toEqual("with(this){return h('div',{'id':id,'class':class,'data-foo':foo},['Hello'])}")
})
