const esmImport = require('esm')(module)
const { getType } = esmImport('../../src/utils.js')

// TODO: add more tests

test('getType', () => {
  var str = 'hello world'
  expect(getType(str)).toEqual('string')

  var obj = {}
  expect(getType(obj)).toEqual('object')

  var bool = true
  expect(getType(bool)).toEqual('boolean')

  var num = 123
  expect(getType(num)).toEqual('number')

  var arr = ['one', 'two']
  expect(getType(arr)).toEqual('array')

  var nullValue = null
  expect(getType(nullValue)).toEqual('null')
})
