let Nuro = require('../../dist/nuro.umd.js')

test('update state', async () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    msg = 'test'
    count = 0
    handleClick() {
      this.count++
      if (this.count === 2) {
        this.msg = 'clicked twice'
      }
    }
    render($) {
      return $('button', {id: 'app', count: this.count, '@click': this.handleClick}, [
        this.msg
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<button id="app" count="0">test</button>`)
  document.getElementById('app').click()
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<button id="app" count="1">test</button>`)
  document.getElementById('app').click()
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<button id="app" count="2">clicked twice</button>`)
})

test('update nested state object', async () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    stateObject = {
      foo: 1
    }
    handleClick() {
      this.stateObject.foo = 2
    }
    render($) {
      return $('button', {id: 'app', '@click': this.handleClick}, [
        this.stateObject.foo
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<button id="app">1</button>`)
  document.getElementById('app').click()
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<button id="app">2</button>`)
})

test('update nested state array', async () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    stateArray = ['one', 'two']
    handleClick() {
      this.stateArray.push('three')
    }
    render($) {
      return $('button', {id: 'app', '@click': this.handleClick}, [
        this.stateArray[this.stateArray.length - 1]
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<button id="app">two</button>`)
  document.getElementById('app').click()
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<button id="app">three</button>`)
})

test('update nested components', async () => {
  document.body.innerHTML = ''
  
  class Counter {
    count = 0
    handleClick() {
      this.count++
    }
    render($) {
      return $('button', {id: this.props.id, '@click': this.handleClick}, [
        this.count
      ])
    }
  }
  class App {
    render($) {
      return $('div', {}, [
        $(Counter, {id: 'counter-1'}),
        $(Counter, {id: 'counter-2'})
      ])
    }
  }
  Nuro.mount(App)

  expect(document.getElementById('counter-1').outerHTML)
    .toEqual(`<button id="counter-1">0</button>`)
  expect(document.getElementById('counter-2').outerHTML)
    .toEqual(`<button id="counter-2">0</button>`)

  document.getElementById('counter-1').click()
  expect(document.getElementById('counter-1').outerHTML)
    .toEqual(`<button id="counter-1">1</button>`)
  expect(document.getElementById('counter-2').outerHTML)
    .toEqual(`<button id="counter-2">0</button>`)

  document.getElementById('counter-2').click()
  document.getElementById('counter-2').click()
  document.getElementById('counter-2').click()
  expect(document.getElementById('counter-1').outerHTML)
    .toEqual(`<button id="counter-1">1</button>`)
  expect(document.getElementById('counter-2').outerHTML)
    .toEqual(`<button id="counter-2">3</button>`)
})

test('update parent component without resetting child component state', async () => {
  document.body.innerHTML = ''
  
  class Child {
    msg = 'Child'
    handleClick() {
      this.msg = 'Child updated'
    }
    render($) {
      return $('button', {id: 'child', '@click': this.handleClick}, [this.msg])
    }
  }
  class Parent {
    msg = 'Parent'
    handleClick() {
      this.msg = 'Parent updated'
    }
    render($) {
      return $('div', {id: 'app'}, [
        $('button', {id: 'parent', '@click': this.handleClick}, [this.msg]),
        $(Child)
      ])
    }
  }
  Nuro.mount(Parent)

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><button id="parent">Parent</button><button id="child">Child</button></div>`)

  document.getElementById('child').click()
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><button id="parent">Parent</button><button id="child">Child updated</button></div>`)

  document.getElementById('parent').click()
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><button id="parent">Parent updated</button><button id="child">Child updated</button></div>`)
  
})

test('update child props when parent state updates', async () => {
  document.body.innerHTML = ''
  
  class Child {
    render($) {
      return $('div', {id: 'child'}, [
        this.props.foo
      ])
    }
  }
  class Parent {
    foo = 'original'
    render($) {
      return $('div', {id: 'app'}, [
        $(Child, {foo: this.foo})
      ])
    }
  }
  let parent = Nuro.mount(Parent)

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><div id="child">original</div></div>`)

  parent.foo = 'updated'
  expect(document.getElementById('app').outerHTML)
  .toEqual(`<div id="app"><div id="child">updated</div></div>`)
  
})

test('update props.children when parent state updates', async () => {
  document.body.innerHTML = ''
  
  class Child {
    render($) {
      return $('div', {id: 'child'}, this.props.children)
    }
  }
  class Parent {
    foo = 'original'
    render($) {
      return $('div', {id: 'app'}, [
        $(Child, {foo: this.foo}, [
          this.foo
        ])
      ])
    }
  }
  let parent = Nuro.mount(Parent)

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><div id="child">original</div></div>`)

  parent.foo = 'updated'
  expect(document.getElementById('app').outerHTML)
  .toEqual(`<div id="app"><div id="child">updated</div></div>`)
  
})

test('calling $update directly', async () => {
  document.body.innerHTML = ''

  let childRenderCount = 0
  let parentRenderCount = 0
  
  class Child {
    render($) {
      childRenderCount++
      return $('div', {id: 'child'}, [
        this.props.foo
      ])
    }
  }
  class Parent {
    foo = 'original'
    render($) {
      parentRenderCount++
      return $('div', {id: 'app'}, [
        $(Child, {foo: this.foo})
      ])
    }
  }
  let parent = Nuro.mount(Parent)

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><div id="child">original</div></div>`)
  expect(parentRenderCount).toEqual(1)
  expect(childRenderCount).toEqual(1)

  parent.$update()
  expect(parentRenderCount).toEqual(2)
  expect(childRenderCount).toEqual(2)

  parent.foo = 'updated'
  expect(document.getElementById('app').outerHTML)
  .toEqual(`<div id="app"><div id="child">updated</div></div>`)
  expect(parentRenderCount).toEqual(3)
  expect(childRenderCount).toEqual(3)
  
})

test('calling $update with new data', async () => {
  document.body.innerHTML = ''

  let childRenderCount = 0
  let parentRenderCount = 0
  
  class Child {
    render($) {
      childRenderCount++
      return $('div', {id: 'child'}, [
        this.props.foo
      ])
    }
  }
  class Parent {
    foo = 'original foo'
    bar = 'original bar'
    render($) {
      parentRenderCount++
      return $('div', {id: 'app'}, [
        $(Child, {foo: this.foo + ' ' + this.bar})
      ])
    }
  }
  let parent = Nuro.mount(Parent)

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><div id="child">original foo original bar</div></div>`)
  expect(parentRenderCount).toEqual(1)
  expect(childRenderCount).toEqual(1)

  parent.$update({
    foo: 'updated foo',
    bar: 'updated bar'
  })
  expect(parentRenderCount).toEqual(2)
  expect(childRenderCount).toEqual(2)
  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id="app"><div id="child">updated foo updated bar</div></div>`)
})
