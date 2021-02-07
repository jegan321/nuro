let Nuro = require('../../build/dist/nuro')

test('simple template', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class App {
    msg = 'Hello, world'
    $template = `
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


test('todo list', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class App {
    tasks = []
    $template = `
      <div id="app">
        <h1>Todo List for {{props.name}}</h1>
        <p $if="tasks.length">Loading...</p>
        <ul>
          <li $for="task, i in tasks" :data-index="i">#{{i+1}}: {{task}}</li>
        </ul>
      </div>
    `
  }

  let app = Nuro.mount(App, document.querySelector('#target'), {name: 'John'})
  expect(document.querySelector('#app h1').innerHTML)
    .toBe('Todo List for John')
  expect(document.querySelector('#app p'))
    .toBe(null)
  expect(document.querySelector('#app ul').children.length)
    .toBe(0)

  app.tasks.push('task one', 'task two')
  expect(document.querySelector('#app h1').innerHTML)
    .toBe('Todo List for John')
  expect(document.querySelector('#app p').innerHTML)
    .toBe('Loading...')
  expect(document.querySelector('#app ul [data-index="0"]').innerHTML)
    .toBe('#1: task one')
  expect(document.querySelector('#app ul [data-index="1"]').innerHTML)
    .toBe('#2: task two')
})

test('nested component', () => {
  document.body.innerHTML = '<div id="target"></div>'

  class SearchBar {
    $template = `
      <input :placeholder="props.placeholder" />
    `
  }

  class App {
    msg = 'Hello, world'
    $template = `
      <div id="app">
        <h1>Test</h1>
        <search-bar placeholder="Search for something"></search-bar>
      </div>
    `
    $includes = {
      SearchBar
    }
  }

  Nuro.mount(App, document.querySelector('#target'))

  expect(document.querySelector('#app h1').innerHTML)
  .toBe('Test')
  expect(document.querySelector('#app input').getAttribute('placeholder'))
  .toBe('Search for something')
})