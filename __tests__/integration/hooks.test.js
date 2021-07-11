let Nuro = require('../../dist/nuro.umd.js')

test('hooks should be called in order', () => {
  document.body.innerHTML = '<div id="target"></div>'

  let calledHooks = []

  class TestComponent {

    msg = 'Hello'

    beforeInit() {
      calledHooks.push('beforeInit')
    }

    beforeMount() {
      calledHooks.push('beforeMount')
    }

    afterMount() {
      calledHooks.push('afterMount')
    }

    beforeRender() {
      calledHooks.push('beforeRender')
    }

    render($) {
      calledHooks.push('render')
      return $('div', {id: 'target'}, [
        this.msg
      ])
    }

    afterRender() {
      calledHooks.push('afterRender')
    }

    beforeUnmount() {
      calledHooks.push('beforeUnmount')
    }

  }

  let component = Nuro.mount(TestComponent, document.querySelector('#target'))

  expect(calledHooks).toEqual([
    'beforeInit',
    'beforeMount',
    'beforeRender',
    'render',
    'afterRender',
    'afterMount'
  ])

  component.msg = "updated"

  expect(calledHooks).toEqual([
    'beforeInit',
    'beforeMount',
    'beforeRender',
    'render',
    'afterRender',
    'afterMount',
    'beforeRender',
    'render',
    'afterRender'
  ])

  Nuro.unmount(document.querySelector('#target'))

  expect(calledHooks).toEqual([
    'beforeInit',
    'beforeMount',
    'beforeRender',
    'render',
    'afterRender',
    'afterMount',
    'beforeRender',
    'render',
    'afterRender',
    'beforeUnmount',
  ])

})

test('beforeUnmount hook should be called for each child component', () => {
  document.body.innerHTML = '<div id="target"></div>'

  let childAUnmount = false
  let childBUnmount = false
  let parentUnmount = false

  class ChildAComponent {
    template = '<div>ChildA</div>'
    beforeUnmount() {
      childAUnmount = true
    }
  }
  class ChildBComponent {
    template = '<div>ChildB</div>'
    beforeUnmount() {
      childBUnmount = true
    }
  }
  document.body.innerHTML = '<div id="app"></div>'

  class ParentComponent {
    template = '<div id="app"><child-a-component></child-a-component><child-b-component></child-b-component></div>'
    includes = { ChildAComponent, ChildBComponent }
    beforeUnmount() {
      parentUnmount = true
    }
  }

  Nuro.mount(ParentComponent, document.querySelector('#app'))

  let unmounted = Nuro.unmount(document.querySelector('#app'))

  expect(unmounted).toEqual(true)
  expect(parentUnmount).toEqual(true)
  expect(childAUnmount).toEqual(true)
  expect(childBUnmount).toEqual(true)
})

test('beforeUnmount hook should be called for each child component after update replaces a component', () => {
  document.body.innerHTML = '<div id="target"></div>'

  let childAUnmount = false
  let childBUnmount = false
  let parentUnmount = false

  class ChildAComponent {
    template = '<div>ChildA</div>'
    beforeUnmount() {
      childAUnmount = true
    }
  }
  class ChildBComponent {
    template = '<div>ChildB</div>'
    beforeUnmount() {
      childBUnmount = true
    }
  }
  document.body.innerHTML = '<div id="app"></div>'

  class ParentComponent {
    template = '<div id="app"><child-a-component></child-a-component><child-b-component></child-b-component></div>'
    includes = { ChildAComponent, ChildBComponent }
    beforeUnmount() {
      parentUnmount = true
    }
  }

  class App {
    show = true
    template = /*html*/ `
      <div id="app">
        <parent-component $if="show"></parent-component>
        <div $if="!show">WTF</div>
      </div>
    `
    includes = { ParentComponent }
  }

  let app = Nuro.mount(App, document.querySelector('#app'))
  app.show = false

  expect(parentUnmount).toEqual(true)
  expect(childAUnmount).toEqual(true)
  expect(childBUnmount).toEqual(true)
})