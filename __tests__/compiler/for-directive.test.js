let Nuro = require('../../dist/nuro.umd.js')
let compileTemplate = Nuro.compileTemplate

test('should compile $for directive with hard coded text', () => {
  let code = compileTemplate('<div><p $for="thing in things">Thing</p></div>')
  expect(code)
  .toEqual("with(this){return h('div',{},[...things.map((thing)=>h('p',{},['Thing']))])}")
})

test('should compile $for directive with dynamic text', () => {
  let code = compileTemplate('<div><p $for="thing in things">{{thing}}</p></div>')
  expect(code)
  .toEqual("with(this){return h('div',{},[...things.map((thing)=>h('p',{},[(thing)]))])}")
})

test('should compile $for directive with var and index', () => {
  let code = compileTemplate('<div><p $for="thing, i in things">{{thing+i}}</p></div>')
  expect(code)
  .toEqual("with(this){return h('div',{},[...things.map((thing, i)=>h('p',{},[(thing+i)]))])}")
})

test('should compile $for directive with dynamic attributes', () => {
  let code = compileTemplate('<div><p $for="thing in things" :data-thing="thing">{{thing}}</p></div>')
  expect(code)
  .toEqual("with(this){return h('div',{},[...things.map((thing)=>h('p',{'data-thing':thing},[(thing)]))])}")
})