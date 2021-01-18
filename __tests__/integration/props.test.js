let Nuro = require('../../build/dist/nuro')

test('simple props', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    render($) {
      return $('div', {id: 'app', 'data-foo': this.props.foo}, [
        this.props.bar
      ])
    }
  }
  Nuro.mount(TestComponent, 
    window.document.querySelector('#target'),
    {foo: 'foo value', bar: 'bar value'})

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app" data-foo="foo value">bar value</div>`)
})

test('props passed from parent component', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class ParentComponent {
    render($) {
      return $(ChildComponent, {foo: 'foo value', bar: 'bar value'})
    }
   }
  class ChildComponent {
    render($) {
      return $('button', {id: 'app', 'data-foo': this.props.foo}, [
        this.props.bar
      ])
    }
  }
  Nuro.mount(ParentComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<button id="app" data-foo="foo value">bar value</button>`)
})

test('component as prop', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class Content {
    render($) {
      return $('p', {}, [
        'My content'
      ])
    }
  }
  class Frame {
    render($) {
      return $('div', {id: 'app'}, [
        $(this.props.content)
      ])
    }
  }
  Nuro.mount(Frame, window.document.querySelector('#target'), {content: Content})

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>My content</p></div>`)
})

test('function as prop', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class Parent {
    foo() {
      return 'foo value'
    }
    render($) {
      return $('div', {id: 'app'}, [
        $(Child, {func: this.foo})
      ])
    }
  }
  class Child {
    render($) {
      let result = this.props.func()
      return $('p', {}, [
        result
      ])
    }
  }
  Nuro.mount(Parent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><p>foo value</p></div>`)
})

test('props.children passed from parent component', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class ParentComponent {
    render($) {
      return $(ChildComponent, {}, [
        $('h1', {class: 'title'}, 'title'),
        $('p', {class: 'content'}, 'content')
      ])
    }
   }
  class ChildComponent {
    render($) {
      return $('div', {id: 'app'}, this.props.children)
    }
  }
  Nuro.mount(ParentComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><h1 class="title">title</h1><p class="content">content</p></div>`)
})

