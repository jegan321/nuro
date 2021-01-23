let Nuro = require('../../build/dist/nuro')

test('nested component', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    className = 'parent'
    render($) {
      return $('div', {id: 'app', class: this.className}, [
        $(MyButton)
      ])
    }
  }
  class MyButton {
    className = 'button'
    render($) {
      return $('button', {class: this.className}, ['My Button'])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app" class="parent"><button class="button">My Button</button></div>`)
})

test('two instances of a component', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    className = 'parent'
    render($) {
      return $('div', {id: 'app', class: this.className}, [
        $(MyButton),
        $(MyButton)
      ])
    }
  }
  class MyButton {
    className = 'button'
    render($) {
      return $('button', {class: this.className}, ['My Button'])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app" class="parent"><button class="button">My Button</button><button class="button">My Button</button></div>`)
})

test('global component', () => {
  document.body.innerHTML = '<div id="target"></div>'


  Nuro.include('my-button', class {
    className = 'button'
    render($) {
      return $('button', {class: this.className}, ['My Button'])
    }
  })

  class TestComponent {
    className = 'parent'
    render($) {
      return $('div', {id: 'app', class: this.className}, [
        $('my-button')
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app" class="parent"><button class="button">My Button</button></div>`)
})