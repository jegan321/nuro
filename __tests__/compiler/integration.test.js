let Nuro = require('../../dist/nuro.umd.js')

test('simple template', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class App {
    msg = 'Hello, world'
    template = /*html*/ `
      <div id="app">
        <h1>Test</h1>
        <p>{{msg}}</p>
      </div>
    `
  }

  Nuro.mount(App, document.querySelector('#target'))

  expect(document.querySelector('#app h1').innerHTML)
  .toBe('Test')
  expect(document.querySelector('#app p').innerHTML)
  .toBe('Hello, world')
})


test('todo list', async () => {
  document.body.innerHTML = '<div id="target"></div>'

  class App {
    tasks = []
    template = /*html*/ `
      <div id="app">
        <h1>Todo List for {{props.name}}</h1>
        <p $if="!tasks.length">Loading...</p>
        <ul>
          <li $for="task, i in tasks" :data-index="i" class="task" $class="{done: task.completed}">
            #{{i+1}}: {{task.desc}}
          </li>
        </ul>
      </div>
    `
  }

  let app = Nuro.mount(App, document.querySelector('#target'), {name: 'John'})
  expect(document.querySelector('#app h1').innerHTML)
    .toBe('Todo List for John')
  expect(document.querySelector('#app p').innerHTML)
    .toBe('Loading...')
  expect(document.querySelector('#app ul').children.length)
    .toBe(0)

  app.tasks.push({desc: 'task one', completed: true}, {desc: 'task two', completed: false})
  await Nuro.afterUpdate()
  expect(document.querySelector('#app h1').innerHTML)
    .toBe('Todo List for John')
  expect(document.querySelector('#app p'))
    .toBe(null)

  expect(document.querySelector('#app ul [data-index="0"]').innerHTML.trim())
    .toBe('#1: task one')
  expect(document.querySelector('#app ul [data-index="0"]').className)
    .toBe('task done')

  expect(document.querySelector('#app ul [data-index="1"]').innerHTML.trim())
    .toBe('#2: task two')
  expect(document.querySelector('#app ul [data-index="1"]').className)
    .toBe('task')
})

test('nested component', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class SearchBar {
    template = `
      <input :placeholder="props.placeholder" />
    `
  }

  class App {
    msg = 'Hello, world'
    template = /*html*/ `
      <div id="app">
        <h1>Test</h1>
        <search-bar placeholder="Search for something"></search-bar>
      </div>
    `
    includes = {
      SearchBar
    }
  }

  Nuro.mount(App, document.querySelector('#target'))

  expect(document.querySelector('#app h1').innerHTML)
  .toBe('Test')
  expect(document.querySelector('#app input').getAttribute('placeholder'))
  .toBe('Search for something')
})

test('set attributes using $attrs', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class SearchBar {
    template = `
      <input class="search" $attrs="props" />
    `
  }

  class App {
    msg = 'Hello, world'
    template = /*html*/ `
      <div id="app">
        <search-bar id="search1" class="large" placeholder="Search for something"></search-bar>
      </div>
    `
    includes = {
      SearchBar
    }
  }

  Nuro.mount(App, document.querySelector('#target'))

  expect(document.querySelector('#app input').getAttribute('id'))
    .toBe('search1')
  expect(document.querySelector('#app input').getAttribute('class'))
    .toBe('search large')
  expect(document.querySelector('#app input').getAttribute('placeholder'))
    .toBe('Search for something')
})

test('nested component with $if', async () => {
  document.body.innerHTML = '<div id="target"></div>'

  class HelloComponent {
    template = `
      <p>Hello</p>
    `
  }

  class App {
    show = true
    template = /*html*/ `
      <div id="app">
        <h1>Title</h1>
        <hello-component $if="show"></hello-component>
      </div>
    `
    includes = {
      HelloComponent
    }
  }

  let app = Nuro.mount(App, document.querySelector('#target'))

  expect(document.querySelector('#app').innerHTML)
    .toEqual(`<h1>Title</h1><p>Hello</p>`)

  app.show = false
  await Nuro.afterUpdate()

  expect(document.querySelector('#app').innerHTML)
    .toEqual(`<h1>Title</h1>`)
})