let Nuro = require('../../build/dist/nuro')

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

    afterUnmount() {
      calledHooks.push('afterUnmount')
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
    'afterUnmount'
  ])

})