let Nuro = require('../../build/dist/nuro')

test('mount without element', () => {

  class TestComponent {
    render($) {
      return $('div', {id: 'app'}, ['Hello'])
    }
  }
  Nuro.mount(TestComponent)

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Hello</div>`)
})

test('mount on element', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    render($) {
      return $('div', {id: 'app'}, ['Hello'])
    }
  }
  Nuro.mount(TestComponent, document.getElementById('target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Hello</div>`)
})

test('mount should return component proxy', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    msg = 'Hello'
    render($) {
      return $('div', {id: 'app'}, [this.msg])
    }
  }
  let testComponent = Nuro.mount(TestComponent, document.getElementById('target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Hello</div>`)

  expect(testComponent.msg)
    .toEqual(`Hello`)
})

test('update component state after mounting', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    msg = 'Hello'
    render($) {
      return $('div', {id: 'app'}, [this.msg])
    }
  }
  let testComponent = Nuro.mount(TestComponent, document.getElementById('target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Hello</div>`)

  testComponent.msg = 'Updated message'
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Updated message</div>`)
})

test('update component props after mounting', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    render($) {
      return $('div', {id: 'app'}, [this.props.msg])
    }
  }
  let testComponent = Nuro.mount(TestComponent, document.getElementById('target'), {
    msg: 'Hello'
  })

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Hello</div>`)
  
  testComponent.props = {
    msg: 'Updated message'
  }
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Updated message</div>`)
})

test('mount on the same element twice with different props', () => {
  document.body.innerHTML = '<div id="app"></div>'

  class TestComponent {
    render($) {
      return $('div', {id: 'app'}, [this.props.msg])
    }
  }
  Nuro.mount(TestComponent, document.getElementById('app'), {
    msg: 'Hello'
  })

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Hello</div>`)
  

  Nuro.mount(TestComponent, document.getElementById('app'), {
    msg: 'Updated message'
  })
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app">Updated message</div>`)
})