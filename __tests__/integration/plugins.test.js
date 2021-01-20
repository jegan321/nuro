let Nuro = require('../../build/dist/nuro')

test('install plugin', () => {

  let installed = 0
  let newApiCalled = false
  let option = null

  let myPlugin = {
    install(Nuro, options) {
      installed++
      Nuro.newApi = () => newApiCalled = true
      option = options.foo
    }
  }

  Nuro.install(myPlugin, { foo: 'foo value' })
  expect(installed).toBe(1)

  Nuro.newApi()
  expect(newApiCalled).toBe(true)
  expect(option).toBe('foo value')

  // Try to install twice, should be ignored the second time
  Nuro.install(myPlugin, { foo: 'foo value' })
  expect(installed).toBe(1)


})