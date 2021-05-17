let Nuro = require('../../dist/nuro.umd.js')

test('push', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class App {
    items = ['one', 'two']
    render($) {
      return $('div', {id: 'app'}, this.items.map(item => $('p', {}, item)))
    }
  }
  let app = Nuro.mount(App, document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>one</p><p>two</p></div>`)
  app.items.push('three')
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>one</p><p>two</p><p>three</p></div>`)
})

test('pop', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class App {
    items = ['one', 'two']
    render($) {
      return $('div', {id: 'app'}, this.items.map(item => $('p', {}, item)))
    }
  }
  let app = Nuro.mount(App, document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>one</p><p>two</p></div>`)
  app.items.pop()
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>one</p></div>`)
})

test('shift', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class App {
    items = ['one', 'two']
    render($) {
      return $('div', {id: 'app'}, this.items.map(item => $('p', {}, item)))
    }
  }
  let app = Nuro.mount(App, document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>one</p><p>two</p></div>`)
  app.items.shift()
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>two</p></div>`)
})

test('unshift', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class App {
    items = ['one', 'two']
    render($) {
      return $('div', {id: 'app'}, this.items.map(item => $('p', {}, item)))
    }
  }
  let app = Nuro.mount(App, document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>one</p><p>two</p></div>`)
  app.items.unshift('three')
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>three</p><p>one</p><p>two</p></div>`)
})

test('splice', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class App {
    items = ['one', 'two']
    render($) {
      return $('div', {id: 'app'}, this.items.map(item => $('p', {}, item)))
    }
  }
  let app = Nuro.mount(App, document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>one</p><p>two</p></div>`)
  app.items.splice(1, 1, 'three')
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>one</p><p>three</p></div>`)
})

test('sort', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class App {
    items = ['a', 'c', 'b']
    render($) {
      return $('div', {id: 'app'}, this.items.map(item => $('p', {}, item)))
    }
  }
  let app = Nuro.mount(App, document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>a</p><p>c</p><p>b</p></div>`)
  app.items.sort()
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>a</p><p>b</p><p>c</p></div>`)
})

test('reverse', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class App {
    items = ['a', 'c', 'b']
    render($) {
      return $('div', {id: 'app'}, this.items.map(item => $('p', {}, item)))
    }
  }
  let app = Nuro.mount(App, document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>a</p><p>c</p><p>b</p></div>`)
  app.items.reverse()
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>b</p><p>c</p><p>a</p></div>`)
})
