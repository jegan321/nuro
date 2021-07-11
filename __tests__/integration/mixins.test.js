let Nuro = require('../../dist/nuro.umd.js')

test('add mixin', () => {

  let hookCalled = false
  let dataFromComponent = ''
  let newMethodCalled = false

  Nuro.mixin({

    /// Add lifecycle hook
    afterMount() {
      hookCalled = true
      dataFromComponent = this.foo
    },

    // Add new method
    $foo() {
      newMethodCalled = true
    }

  })

  let component = Nuro.mount(class {
    foo = 'foo value'
    template = '<div></div>'
  })
  expect(hookCalled).toBe(true)
  expect(dataFromComponent).toBe('foo value')
  
  component.$foo()
  expect(newMethodCalled).toBe(true)

})