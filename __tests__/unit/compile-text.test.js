const esmImport = require('esm')(module)
const { compileText } = esmImport('../../src/compiler.js')

it('{{msg}}', () => {
  var output = compileText('{{msg}}')
  expect(output).toEqual(`(msg)`)
})

it('normal text', () => {
  var output = compileText('normal text')
  expect(output).toEqual(`'normal text'`)
})

it('Hello {{name}}', () => {
  var output = compileText('Hello {{name}}')
  expect(output).toEqual(`'Hello '+(name)`)
})

it('{{name}} is my name', () => {
  var output = compileText('{{name}} is my name')
  expect(output).toEqual(`(name)+' is my name'`)
})

it('{{last}}, {{first}}', () => {
  var output = compileText('{{last}}, {{first}}')
  expect(output).toEqual(`(last)+', '+(first)`)
})

it('Hello {{person.name.first}}', () => {
  var output = compileText('Hello {{person.name.first}}')
  expect(output).toEqual(`'Hello '+(person.name.first)`)
})

it('Hello {{name.toUpperCase()}}', () => {
  var output = compileText('Hello {{name.toUpperCase()}}')
  expect(output).toEqual(`'Hello '+(name.toUpperCase())`)
})

it(`People {{people.split('... ')}}`, () => {
  var output = compileText(`People {{people.split('... ')}}`)
  expect(output).toEqual(`'People '+(people.split('... '))`)
})

it(`{{helper(msg, '...', false')}}`, () => {
  var output = compileText(`{{helper(msg, '...', false')}}`)
  expect(output).toEqual(`(helper(msg, '...', false'))`)
})

it('{ Just literal brackets {. One more: {', () => {
  var output = compileText('{ Just literal brackets {. One more: {')
  expect(output).toEqual(`'{ Just literal brackets {. One more: {'`)
})
