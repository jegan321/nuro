let Nuro = require('../../build/dist/nuro.umd.js')

test('unmount', () => {
  document.body.innerHTML = '<div id="app"></div>'

  class TestComponent {
    foo = 'foo value'
    bar = 'bar value'
    render($) {
      return $('div', {id: 'app', 'data-foo': this.foo}, [
        this.bar
      ])
    }
  }
  Nuro.mount(TestComponent, document.querySelector('#app'))

  let result = Nuro.unmount(document.querySelector('#app'))

  expect(result).toBe(true)
})

test('unmount element on element that doesn\'t have a component', () => {
  document.body.innerHTML = '<div id="app"></div>'

  let result = Nuro.unmount(document.querySelector('#app'))

  expect(result).toBe(false)
})