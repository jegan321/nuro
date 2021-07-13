let Nuro = require('../../dist/nuro.umd.js')
let compileTemplate = Nuro.compileTemplate

test('should compile $bind directive on input', () => {
  let code = compileTemplate('<input $bind="name">')
  expect(code)
  .toEqual(`with(this){return h('input',{'value':name,'@input':(e)=>{this.name=e.target.value;this.$update()}})}`)
})

test('should compile $bind directive on text input', () => {
  let code = compileTemplate('<input type="input" $bind="name">')
  expect(code)
  .toEqual(`with(this){return h('input',{'type':'input','value':name,'@input':(e)=>{this.name=e.target.value;this.$update()}})}`)
})

test('should compile $bind directive on textarea', () => {
  let code = compileTemplate('<textarea $bind="name">')
  expect(code)
  .toEqual(`with(this){return h('textarea',{'value':name,'@input':(e)=>{this.name=e.target.value;this.$update()}})}`)
})

test('should compile $bind directive on checkbox', () => {
  let code = compileTemplate('<input type="checkbox" $bind="name">')
  expect(code)
  .toEqual(`with(this){return h('input',{'type':'checkbox','checked':name,'@change':(e)=>{this.name=e.target.checked;this.$update()}})}`)
})

test('should compile $bind directive on select', () => {
  let code = compileTemplate('<select $bind="name">')
  expect(code)
  .toEqual(`with(this){return h('select',{'value':name,'@change':(e)=>{this.name=e.target.value;this.$update()}})}`)
})