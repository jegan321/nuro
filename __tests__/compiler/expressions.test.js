let Nuro = require('../../build/dist/nuro.umd.js')
let compileTemplate = Nuro.compileTemplate

test('should compile variable expression', () => {
  let code = compileTemplate('<div>{{foo}}</div>')
  expect(code)
  .toEqual("with(this){return h('div',{},[(foo)])}")
})

test('should compile ternary expression', () => {
  let code = compileTemplate('<div>{{flag ? first : second}}</div>')
  expect(code)
  .toEqual("with(this){return h('div',{},[(flag ? first : second)])}")
})

test('should compile string literal expression', () => {
  let code = compileTemplate("<div>{{'my string'}}</div>")
  expect(code)
  .toEqual("with(this){return h('div',{},[('my string')])}")
})

test('should compile toUpperCase() expression', () => {
  let code = compileTemplate("<div>{{'my string'.toUpperCase()}}</div>")
  expect(code)
  .toEqual("with(this){return h('div',{},[('my string'.toUpperCase())])}")
})

test('should compile number expression', () => {
  let code = compileTemplate("<div>{{123}}</div>")
  expect(code)
  .toEqual("with(this){return h('div',{},[(123)])}")
})

test('should compile boolean expression', () => {
  let code = compileTemplate("<div>{{false}}</div>")
  expect(code)
  .toEqual("with(this){return h('div',{},[(false)])}")
})

test('should compile boolean expression', () => {
  let code = compileTemplate("<div>{{false}}</div>")
  expect(code)
  .toEqual("with(this){return h('div',{},[(false)])}")
})

test('should compile variable in attribute', () => {
  let code = compileTemplate('<div class="{{foo}}">Hello</div>')
  expect(code)
  .toEqual("with(this){return h('div',{'class':(foo)},['Hello'])}")
})

test('should compile variable plus text in attribute', () => {
  let code = compileTemplate(`<div class="{{foo}}bar">Hello</div>`)
  expect(code)
  .toEqual("with(this){return h('div',{'class':(foo)+'bar'},['Hello'])}")
})

test('should compile text plus variable in attribute', () => {
  let code = compileTemplate(`<div class="bar{{foo}}">Hello</div>`)
  expect(code)
  .toEqual("with(this){return h('div',{'class':'bar'+(foo)},['Hello'])}")
})
