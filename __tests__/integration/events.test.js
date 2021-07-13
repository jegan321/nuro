let Nuro = require('../../dist/nuro.umd.js')

test('click call function', async () => {
  document.body.innerHTML = '<div id="target"></div>'

  let success = false
  function handleClick() {
    success = true
  }

  class TestComponent {
    render($) {
      return $('div', {id: 'target', '@click': handleClick}, [
        'Nuro'
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  // Simulate a click
  document.getElementById('target').click()
  await Nuro.afterUpdate()

  expect(success).toEqual(true)
})

test('click call method', async () => {
  document.body.innerHTML = '<div id="target"></div>'

  let success = false

  class TestComponent {
    handleClick() {
      success = true
    }
    render($) {
      return $('div', {id: 'target', '@click': this.handleClick}, [
        'Nuro'
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  // Simulate a click
  document.getElementById('target').click()
  await Nuro.afterUpdate()

  expect(success).toEqual(true)
})

test('click call method using instance variable', async () => {
  document.body.innerHTML = '<div id="target"></div>'

  let result = ''

  class TestComponent {
    instanceVar = 'my var'
    handleClick() {
      result = this.instanceVar
    }
    render($) {
      return $('div', {id: 'target', '@click': this.handleClick}, [
        'Nuro'
      ])
    }
  }
  Nuro.mount(TestComponent, window.document.querySelector('#target'))

  // Simulate a click
  document.getElementById('target').click()
  await Nuro.afterUpdate()

  expect(result).toEqual('my var')
})

test('toggle event listener', async () => {
  document.body.innerHTML = '<div id="target"></div>'

  class TestComponent {
    clickEnabled = true
    clickCount = 0
    handleClick() {
      this.clickCount++
    }
    doNothing() {

    }
    render($) {
      return $('div', {id: 'target', '@click': this.clickEnabled ? this.handleClick : this.doNothing}, [
        'Nuro'
      ])
    }
  }
  let component = Nuro.mount(TestComponent, window.document.querySelector('#target'))

  document.getElementById('target').click()
  await Nuro.afterUpdate()

  expect(component.clickCount).toEqual(1)

  component.clickEnabled = false
  await Nuro.afterUpdate()

  document.getElementById('target').click()
  await Nuro.afterUpdate()

  expect(component.clickCount).toEqual(1)

})