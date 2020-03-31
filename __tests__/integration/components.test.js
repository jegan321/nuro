const Nuro = require('../../build/nuro.js')

test('component with static template', () => {
  document.body.innerHTML = `
      <div id="app"><h1>Heading</h1><greeting></greeting></div>
  `

  var greeting = {
    template: '<p>Hello world</p>'
  }

  Nuro.create({
    root: '#app',
    components: {
      greeting: greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>Heading</h1><p>Hello world</p>`)
})

test('component with expression', () => {
  document.body.innerHTML = `
      <div id="app"><h1>Heading</h1><greeting></greeting></div>
  `

  var greeting = {
    template: '<p>Hello {{name}}</p>',
    data: {
      name: 'world'
    }
  }

  Nuro.create({
    root: '#app',
    components: {
      greeting: greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>Heading</h1><p>Hello world</p>`)
})

test('multiple components', () => {
  document.body.innerHTML = `
      <div id="app"><h1>Heading</h1><greeting></greeting><greeting></greeting></div>
  `

  var greeting = {
    template: '<p>Hello {{name}}</p>',
    data: {
      name: 'world'
    }
  }

  Nuro.create({
    root: '#app',
    components: {
      greeting: greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(
    `<h1>Heading</h1><p>Hello world</p><p>Hello world</p>`
  )
})

test('nested components', () => {
  document.body.innerHTML = `
      <div id="app"><h1>Heading</h1><greeting></greeting></div>
  `

  var myname = {
    template: '<span>{{name}}</span',
    data: {
      name: 'world'
    }
  }

  var greeting = {
    template: '<p>Hello <myname></myname></p>',
    components: {
      myname: myname
    }
  }

  Nuro.create({
    root: '#app',
    components: {
      greeting: greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(
    `<h1>Heading</h1><p>Hello <span>world</span></p>`
  )
})

test('component with default slot', () => {
  document.body.innerHTML = `
      <div id="app"><h1>Heading</h1><greeting><span>world</span></greeting></div>
  `

  var greeting = {
    template: '<p>Hello <slot></slot></p>'
  }

  Nuro.create({
    root: '#app',
    components: {
      greeting: greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(
    `<h1>Heading</h1><p>Hello <span>world</span></p>`
  )
})

test('component with default slot and text', () => {
  document.body.innerHTML = `
      <div id="app"><h1>Heading</h1><greeting>world</greeting></div>
  `

  var greeting = {
    template: '<p>Hello <slot></slot></p>'
  }

  Nuro.create({
    root: '#app',
    components: {
      greeting: greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>Heading</h1><p>Hello world</p>`)
})

test('component with default slot but nothing passed', () => {
  document.body.innerHTML = `
      <div id="app"><h1>Heading</h1><greeting></greeting></div>
  `

  var greeting = {
    template: '<p>Hello <slot></slot></p>'
  }

  Nuro.create({
    root: '#app',
    components: {
      greeting: greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>Heading</h1><p>Hello </p>`)
})

test('component with default slot and multiple nodes passed', () => {
  document.body.innerHTML = `
      <div id="app"><h1>Heading</h1><greeting>world<span>!!!</span></greeting></div>
  `

  var greeting = {
    template: '<p>Hello <slot></slot></p>'
  }

  Nuro.create({
    root: '#app',
    components: {
      greeting: greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(
    `<h1>Heading</h1><p>Hello world<span>!!!</span></p>`
  )
})

test('component without default slot but something passed and ignored', () => {
  document.body.innerHTML = `
      <div id="app"><h1>Heading</h1><greeting>world</greeting></div>
  `

  var greeting = {
    template: '<p>Hello </p>'
  }

  Nuro.create({
    root: '#app',
    components: {
      greeting: greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>Heading</h1><p>Hello </p>`)
})

test('component with named slots', () => {
  document.body.innerHTML = `
      <div id="app"><h1>Heading</h1><greeting><span $slot="msg">Hello</span><span $slot="name">world</span></greeting></div>
  `

  var greeting = {
    template: '<p><slot name="msg"></slot><slot name="name"></slot></p>'
  }

  Nuro.create({
    root: '#app',
    components: {
      greeting: greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(
    `<h1>Heading</h1><p><span>Hello</span><span>world</span></p>`
  )
})

test('component with slot named "default"', () => {
  document.body.innerHTML = `
      <div id="app"><h1>Heading</h1><greeting><span>world</span></greeting></div>
  `

  var greeting = {
    template: '<p>Hello <slot name="default"></slot></p>'
  }

  Nuro.create({
    root: '#app',
    components: {
      greeting: greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(
    `<h1>Heading</h1><p>Hello <span>world</span></p>`
  )
})

test('component with hardcoded string prop', () => {
  document.body.innerHTML = `
        <div id="app"><h1>Heading</h1><greeting msg="Hello world"></greeting></div>
    `

  var greeting = {
    template: '<p>{{args.msg}}!</p>'
  }

  Nuro.create({
    root: '#app',
    components: {
      greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>Heading</h1><p>Hello world!</p>`)
})

test('component with variable string prop', () => {
  document.body.innerHTML = `
        <div id="app"><h1>Heading</h1><greeting msg="{{greetingMsg}}"></greeting></div>
    `

  var greeting = {
    template: '<p>{{args.msg}}!</p>'
  }

  Nuro.create({
    root: '#app',
    data: {
      greetingMsg: 'Hello world'
    },
    components: {
      greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>Heading</h1><p>Hello world!</p>`)
})

test('component with hardcoded number and boolean', () => {
  document.body.innerHTML = `
        <div id="app"><h1>Heading</h1><greeting count="{{2}}" show="{{true}}"></greeting></div>
    `

  var greeting = {
    template: '<p $if="args.show && args.count > 1">Hello world</p>'
  }

  Nuro.create({
    root: '#app',
    data: {
      greetingMsg: 'Hello world'
    },
    components: {
      greeting
    }
  })

  expect(document.querySelector('#app').innerHTML).toEqual(`<h1>Heading</h1><p>Hello world</p>`)
})
