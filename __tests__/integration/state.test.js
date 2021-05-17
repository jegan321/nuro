let Nuro = require('../../dist/nuro.umd.js')

test('simple state', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    foo = 'foo value'
    bar = 'bar value'
    render($) {
      return $('div', {id: 'app', 'data-foo': this.foo}, [
        this.bar
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app" data-foo="foo value">bar value</div>`)
})

test('array in state', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    things = [{desc: 'one'}, {desc: 'two'}]
    render($) {
      return $('div', {id: 'app'}, this.things.map(thing => {
        return $('button', {}, [
          thing.desc
        ])
      }))
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><button>one</button><button>two</button></div>`)
})