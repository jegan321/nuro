let Nuro = require('../../build/dist/nuro')

test('basic component', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    text = 'Nuro'
    render($) {
      return $('div', {id: 'app'}, [
        this.text
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Nuro</div>`)
})

test('nested elements', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    render($) {
      return $('div', {id: 'app', class: 'container'}, [
        $('h1', {}, [
          'Nuro'
        ]),
        $('br'),
        $('ul', {class: 'list'}, [
          $('li', {'data-index': 0}, ['one']),
          $('li', {'data-index': 1}, ['two'])
        ])
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app" class="container"><h1>Nuro</h1><br><ul class="list"><li data-index="0">one</li><li data-index="1">two</li></ul></div>`)
})

test('multiple components on same page', () => {
  document.body.innerHTML = '<div id="target1"></div>'
    + '<div id="target2"></div>'
    + '<div id="target3"></div>'

  
  Nuro.mount(class {
    render($) {
      return $('div', {id: 'target1'}, [
        'Component 1'
      ])
    }
  }, window.document.querySelector('#target1'))
  Nuro.mount(class {
    render($) {
      return $('div', {id: 'target2'}, [
        'Component 2'
      ])
    }
  }, window.document.querySelector('#target2'))
  Nuro.mount(class {
    render($) {
      return $('div', {id: 'target3'}, [
        'Component 3'
      ])
    }
  }, window.document.querySelector('#target3'))

  expect(document.getElementById('target1').outerHTML)
    .toEqual(`<div id="target1">Component 1</div>`)
  expect(document.getElementById('target2').outerHTML)
    .toEqual(`<div id="target2">Component 2</div>`)
  expect(document.getElementById('target3').outerHTML)
    .toEqual(`<div id="target3">Component 3</div>`)
})

test('mount on existing HTML', () => {
  document.body.innerHTML = `
    <div id="target" class="existing">
      <!-- existing content -->
      <p>Existing content</p>
    </div>
  `

  class TestComponent {
    render($) {
      return $('div', {id: 'app'}, [
        'Nuro'
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Nuro</div>`)
})

test('render svg', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    render($) {
      return $('div', {id: 'app'}, [
        $('svg', {height: '100', width: '100'}, [
          $('circle', {cx: '50', cy: '50', r: '40'})
        ])
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><svg height="100" width="100"><circle cx="50" cy="50" r="40"></circle></svg></div>`)
})

test('render checkbox', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    render($) {
      return $('div', {id: 'app'}, [
        $('input', {type: 'checkbox', checked: true})
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><input type="checkbox" checked="true"></div>`)
})

test('render string', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    val = 'foo'
    render($) {
      return $('div', {id: 'app'}, [
        this.val
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">foo</div>`)
})

test('render boolean', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    val = true
    render($) {
      return $('div', {id: 'app'}, [
        this.val
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">true</div>`)
})

test('render number', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    val = 123
    render($) {
      return $('div', {id: 'app'}, [
        this.val
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">123</div>`)
})

test('render object', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    val = {'foo':'bar'}
    render($) {
      return $('div', {id: 'app'}, [
        this.val
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">[object Object]</div>`)
})

test('render date', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    val = new Date(99123456789)
    render($) {
      return $('div', {id: 'app'}, [
        this.val
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Wed Feb 21 1973 00:17:36 GMT-0600 (Central Standard Time)</div>`)
})

test('render children as scalar instead of array', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    render($) {
      return $('div', {id: 'app'}, 'Hello')
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Hello</div>`)
})
