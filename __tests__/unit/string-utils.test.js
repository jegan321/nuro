const esmImport = require('esm')(module)
const { camelCaseToKebabCase, isLetter } = esmImport('../../compiled/util/string-utils.js')

test('should convert camel case to kebab case', () => {
  expect(camelCaseToKebabCase('my-string-value')).toEqual('my-string-value')
  expect(camelCaseToKebabCase('myStringValue')).toEqual('my-string-value')
  expect(camelCaseToKebabCase('UpperCaseStringValue')).toEqual('upper-case-string-value')
  expect(camelCaseToKebabCase('ABC')).toEqual('a-b-c')
  expect(camelCaseToKebabCase('abc')).toEqual('abc')
  expect(camelCaseToKebabCase('a&b')).toEqual('a&b')
  expect(camelCaseToKebabCase('a')).toEqual('a')
  expect(camelCaseToKebabCase('A')).toEqual('a')
})

test('should check if a character is a letter', () => {
  expect(isLetter('a')).toEqual(true)
  expect(isLetter('A')).toEqual(true)
  expect(isLetter('z')).toEqual(true)
  expect(isLetter('Z')).toEqual(true)
  expect(isLetter('1')).toEqual(false)
  expect(isLetter('!')).toEqual(false)
  expect(isLetter('aa')).toEqual(false)
})