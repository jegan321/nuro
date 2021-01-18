const esmImport = require('esm')(module)
const { camelCaseToKebabCase } = esmImport('../../build/compiled/util/string-utils.js')

test('should convert camel case to kebab case', () => {
  expect(camelCaseToKebabCase('myStringValue')).toEqual('my-string-value')
  expect(camelCaseToKebabCase('UpperCaseStringValue')).toEqual('upper-case-string-value')
  expect(camelCaseToKebabCase('ABC')).toEqual('a-b-c')
  expect(camelCaseToKebabCase('abc')).toEqual('abc')
})