let Nuro = require('../../build/dist/nuro')
let compileTemplate = Nuro.compileTemplate

test('should compile $if directive', () => {
  let code = compileTemplate('<div><p $if="show">Show</p></div>')
  expect(code)
  .toEqual("with(this){return h('div',{},[(show)?h('p',{},['Show']):''])}")
})

test('should compile $if directive with expression', () => {
  let code = compileTemplate('<div><p $if="name !== null">Show</p></div>')
  expect(code)
  .toEqual("with(this){return h('div',{},[(name !== null)?h('p',{},['Show']):''])}")
})