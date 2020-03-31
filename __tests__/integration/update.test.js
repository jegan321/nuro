const Nuro = require('../../build/nuro.js')

test('update', () => {
  document.body.innerHTML = `
        <div id="app"><h1>{{title.toUpperCase()}}</h1><span $for="i in items">{{i}}</span></div>
    `
  var app = Nuro.create({
    root: '#app',
    data: {
      title: 'Hello',
      items: ['first', 'second', 'third']
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(
    `<h1>HELLO</h1><span>first</span><span>second</span><span>third</span>`
  )

  app.update({
    title: 'Goodbye',
    items: ['new one']
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>GOODBYE</h1><span>new one</span>`)
})

test('update nested object', () => {
  document.body.innerHTML = `
        <div id="app">{{name.last}}, {{name.first}} {{age}}</div>
    `
  var app = Nuro.create({
    root: '#app',
    data: {
      name: {
        first: 'john',
        last: 'smith'
      },
      age: 30
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`smith, john 30`)

  app.update({
    name: {
      first: 'johnny'
    },
    age: 31
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`smith, johnny 31`)
})

// This test was failing when var was used in diff.js diffAttributes instead of const or let
test('update attributes', () => {
  document.body.innerHTML = `
    <div id="app"><input $for="t in things" name="{{t}}" type="checkbox"/></div>
  `
  var app = Nuro.create({
    root: '#app',
    data: {
      things: ['one', 'two', 'three']
    }
  })

  expect(document.querySelector('#app').childNodes[0].getAttribute('name')).toEqual(`one`)
  expect(document.querySelector('#app').childNodes[1].getAttribute('name')).toEqual(`two`)
  expect(document.querySelector('#app').childNodes[2].getAttribute('name')).toEqual(`three`)

  app.update({
    things: ['two', 'three']
  })

  expect(document.querySelector('#app').childNodes[0].getAttribute('name')).toEqual(`two`)
  expect(document.querySelector('#app').childNodes[1].getAttribute('name')).toEqual(`three`)
})
