const Nuro = require('../../build/nuro.js')

test('$if', () => {
  document.body.innerHTML = `
        <div id="app"><h1 $if="red">Red</h1><h1 $if="blue">Blue</h1></div>
    `
  var app = Nuro.create({
    root: '#app',
    data: {
      red: true,
      blue: false
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>Red</h1>`)

  app.update({
    red: false,
    blue: true
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>Blue</h1>`)
})

test('$if false', () => {
  document.body.innerHTML = `
        <div id="app"><h1 $if="!red">Red</h1><h1 $if="!blue">Blue</h1></div>
    `
  var app = Nuro.create({
    root: '#app',
    data: {
      red: true,
      blue: false
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>Blue</h1>`)

  app.update({
    red: false,
    blue: true
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>Red</h1>`)
})
