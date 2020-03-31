const Nuro = require('../../build/nuro.js')

test('$for', () => {
  document.body.innerHTML = `
        <div id="app"><span $for="i in items">{{i}}</span></div>
    `
  Nuro.create({
    root: '#app',
    data: {
      items: ['first', 'second', 'third']
    }
  })
  expect(document.querySelector('#app').innerHTML).toEqual(
    `<span>first</span><span>second</span><span>third</span>`
  )
})

test('$for ul', () => {
  document.body.innerHTML = `
        <div id="app">
            <ul id="list"><li $for="item in items">{{item}}</li></ul>
        </div>
    `
  Nuro.create({
    root: '#app',
    data: {
      items: ['first', 'second', 'third']
    }
  })
  expect(document.querySelector('#list').childNodes[0].innerHTML).toEqual(`first`)
  expect(document.querySelector('#list').childNodes[1].innerHTML).toEqual(`second`)
  expect(document.querySelector('#list').childNodes[2].innerHTML).toEqual(`third`)
})

test('Nested $for', () => {
  document.body.innerHTML = `
        <div id="app">
            <div id="categories"><div $for="category in categories"><div $for="item in category.items">{{category.name}}: {{item}}</div></div></div>
        </div>
    `
  Nuro.create({
    root: '#app',
    data: {
      categories: [
        { name: 'A', items: ['A1', 'A2'] },
        { name: 'B', items: ['B1', 'B2'] }
      ]
    }
  })
  expect(document.querySelector('#categories').childNodes[0].childNodes[0].innerHTML).toEqual(
    `A: A1`
  )
  expect(document.querySelector('#categories').childNodes[0].childNodes[1].innerHTML).toEqual(
    `A: A2`
  )
  expect(document.querySelector('#categories').childNodes[1].childNodes[0].innerHTML).toEqual(
    `B: B1`
  )
  expect(document.querySelector('#categories').childNodes[1].childNodes[1].innerHTML).toEqual(
    `B: B2`
  )
})
