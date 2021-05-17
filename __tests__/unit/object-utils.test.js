const esmImport = require('esm')(module)
const { isObject, isArray, isFunction } = esmImport('../../compiled/util/object-utils.js')

test('should test whether a value is an object', () => {
  expect(isObject({})).toEqual(true)
  expect(isObject({foo: 'bar'})).toEqual(true)

  expect(isObject('foo')).toEqual(false)
  expect(isObject(true)).toEqual(false)
  expect(isObject(123)).toEqual(false)
  expect(isObject(null)).toEqual(false)
  expect(isObject([])).toEqual(false)
  expect(isObject(()=>{})).toEqual(false)
})

test('should test whether a value is an array', () => {
  expect(isArray([])).toEqual(true)
  expect(isArray(['foo'])).toEqual(true)

  expect(isArray('foo')).toEqual(false)
  expect(isArray(true)).toEqual(false)
  expect(isArray(123)).toEqual(false)
  expect(isArray(null)).toEqual(false)
  expect(isArray({})).toEqual(false)
  expect(isArray(()=>{})).toEqual(false)
})

test('should test whether a value is a function', () => {
  expect(isFunction(()=>{})).toEqual(true)
  expect(isFunction(function(){})).toEqual(true)

  expect(isFunction('foo')).toEqual(false)
  expect(isFunction(true)).toEqual(false)
  expect(isFunction(123)).toEqual(false)
  expect(isFunction(null)).toEqual(false)
  expect(isFunction({})).toEqual(false)
  expect(isFunction([])).toEqual(false)
})