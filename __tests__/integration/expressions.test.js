const Nuro = require('../../build/nuro.js')

test('String expressions', () => {
  document.body.innerHTML = `
        <div id="app">{{msg}}, {{person.first}} {{person.last}}!</div>
    `
  Nuro.create({
    root: '#app',
    data: {
      msg: 'Hello',
      person: {
        first: 'John',
        last: 'Smith'
      }
    }
  })
  expect(document.querySelector('#app').innerHTML).toEqual(`Hello, John Smith!`)
})

test('String methods', () => {
  document.body.innerHTML = `
        <div id="app">{{msg.toUpperCase()}}, {{people.join(' and ')}}!</div>
    `
  Nuro.create({
    root: '#app',
    data: {
      msg: 'Hello',
      people: ['Jack', 'Jill']
    }
  })
  expect(document.querySelector('#app').innerHTML).toEqual(`HELLO, Jack and Jill!`)
})

test('Helper function', () => {
  document.body.innerHTML = `
        <div id="app">{{exclaim(msg)}}</div>
    `
  Nuro.create({
    root: '#app',
    data: {
      msg: 'Hello',
      exclaim: msg => {
        return msg.toUpperCase() + '!'
      }
    }
  })
  expect(document.querySelector('#app').innerHTML).toEqual(`HELLO!`)
})

test('Ternary operator', () => {
  document.body.innerHTML = `
        <div id="app">{{ product.onSale ? product.salePrice : product.price }}</div>
    `
  var app = Nuro.create({
    root: '#app',
    data: {
      product: {
        price: 19.99
      }
    }
  })
  expect(document.querySelector('#app').innerHTML).toEqual(`19.99`)
  app.update({
    product: {
      onSale: true,
      salePrice: 15.99
    }
  })
  expect(document.querySelector('#app').innerHTML).toEqual(`15.99`)
})

test('Expressions in attributes', () => {
  document.body.innerHTML = `
        <div id="app"><h1 id="{{id}}">Hello</h1></div>
    `
  Nuro.create({
    root: '#app',
    data: {
      id: '123'
    }
  })
  expect(document.querySelector('#app').childNodes[0].getAttribute('id')).toEqual(`123`)
})
