const esmImport = require('esm')(module)
const { callHook } = esmImport('../../src/hooks.js')

test('hooks', () => {
  var component = {
    msg: '',
    __ctx: {
      hooks: {
        afterCreate: function() {
          this.msg = 'hello '
        },
        beforeUpdate: function(newData) {
          this.msg += newData
        }
      }
    }
  }

  callHook(component, 'afterCreate')
  callHook(component, 'beforeUpdate', 'world')

  expect(component.msg).toEqual('hello world')
})
