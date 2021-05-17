let Nuro = require('../../build/dist/nuro.umd.js')
let compileTemplate = Nuro.compileTemplate

test('should compile div with comment', () => {
  let code = compileTemplate(`<div><!--Comment--></div>`)
  expect(code)
  .toEqual("with(this){return h('div',{})}")
})

test('should compile div with comment and paragraph', () => {
  let code = compileTemplate(`<div><!--Comment--><p>Hello</p></div>`)
  expect(code)
  .toEqual("with(this){return h('div',{},[h('p',{},['Hello'])])}")
})

test('should compile div with comment and other children', () => {
  let code = compileTemplate(`<div><!--Comment--><h1>Title</h1><p>Hello</p></div>`)
  expect(code)
  .toEqual("with(this){return h('div',{},[h('h1',{},['Title']),h('p',{},['Hello'])])}")
})

test('should compile div with multiple comments and other children', () => {
  let code = compileTemplate(`<div><!--Comment--><h1>Title</h1><!--Comment--><p>Hello<!--Comment--></p></div>`)
  expect(code)
  .toEqual("with(this){return h('div',{},[h('h1',{},['Title']),h('p',{},['Hello'])])}")
})