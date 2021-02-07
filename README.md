# Nuro

Nuro is a reactive, component-based JavaScript framework which can be used as a lighter and simpler alternative to frameworks like React or Vue.

```js
  class App {
    name = 'world'
    $template = `
      <div id="app">
        <input @input="handleChange" placeholder="Enter your name"/>
        <p>Hello, {{name}}</p>
      </div>
    `
    handleChange(event) {
      this.name = event.target.value
    }
  }
  Nuro.mount(App)
```

## Goals
* Lightweight (3kb minified and gzipped)
* Easy to learn and simple to use
* Can be used for your entire application or sprinkled in
* No build step required

## Features
* Class based components without importing the framework
* Powerful template syntax
* Automatically updates when state changes
* Updates only the DOM elements that have changed
* Event handling
* Automatically encodes HTML from users to prevent script injection

## Installation
Install using npm or a script tag
```bash
npm install nuro
```
```html
<script src="path/to/nuro.js"></script>
```
  
# Documentation

## Components
Components are defined using JavaScript classes:
```js
class MyComponent { 
  $template = `<div id="app">Hello, world</div>` 
}
```
Component classes don't require any base class to be extended or functions to be imported. Just add a template and any lifecycle hooks you need and pass it to `Nuro.mount()`. Nuro will instantiate an instance of your component, compile the template and call any hooks automatically.

## Mounting
Mounting will render the initial version of your UI using the default state of the component. By default your component will be mounted on a new element which is automatically appended to the body of the page:
```js
Nuro.mount(MyComponent)
```
If you want to mount on a specific element instead, you can provid the element as the second argument:
```js
Nuro.mount(MyComponent, document.querySelector('#app'))
```
You can also pass props as the third argument:
```js
Nuro.mount(MyComponent, document.querySelector('#app'), { foo: 'bar' })
```

## Props
Props are variables you can pass to a component to be used during rendering. They are stored in an object in your component called `props` and can be referenced in your templates:
```js
class Greeter {
  $template = `<p>Hello, {{props.name}]</p>`
}
Nuro.mount(Greeter, document.querySelector('#app'), { name: 'world' })
```

## State
State is data that can be stored in your component and persist between renders. Getting and setting state is extremely easy. Just set a property on your component and then it can be referenced by name in your template:
```js
class App {
  msg = "My state variable"
  $template = `<div>{{msg}}</div>`
}
Nuro.mount(App)
```

## Reactivity
Changing state or props on a component instance will automatically trigger a re-render. The mount function always returns the instance of the component that was created. You can then change any properties you want and the UI will be updated accordingly. 
```js
class Status {
  text = 'Waiting...'
  $template = `<p>{{text}}</p>`
}
let status = Nuro.mount(Status)
setTimeout(() => status.text = 'Done!', 1000)
```

## Events
Component state can also be changed internally using event handlers. Just add an attribute with '@' and an event type and set the value to a function:
```js
class Clicker {
  count = 0
  $template = `<button @click="increment">Clicked {{count}} times</button>`
  increment() {
    this.count++
  }
}
```

## Template Directives
Template directives are special HTML attributes and tags that add dyanmic behavior, such as if statements and loops.

## $if directive
Only renders the element if the condition is truthy
```js
class Peekaboo {
  show = false
  $template = `
    <div>
      <button @click="toggleText">{{show ? 'Hide' : 'Show'}}</button>
      <p $if="show">Peekaboo!</p>
    </div>
  `
  toggleText() {
    this.show = !this.show
  }
}
```

## $for directive
Renders a list of elements
```js
class Todos {
  tasks = ['First', 'Second', 'Third']
  $template = `
    <div>
      <h1>Todo List</h1>
      <ul>
        <li $for="task in tasks">{{task}}</li>
      </ul>
    </div>
  `
}
```

## Render Methods
In some cases you may want to write the rendering logic yourself instead of using a template string. A render method is a function that produces the DOM structure for the component. It has one parameter which is a function that creates a single virtual DOM element. This is called the createElement function. It can be called anything in your render method but the documentation will use `h`. This concept should be familiar to developers who have worked with React or similar frameworks. 

The following render method:
```js
class MyComponent {
  render(h) {
    return h('div', {id: 'app'}, [
      h('h1', {}, ['Nuro is: ']),
      h('ul', {class: 'list'}, [
        h('li', {}, ['Fun']),
        h('li', {}, ['Easy to learn'])
      ])
    ])
  }
}
```
will produce this HTML:
```html
<div id="app">
  <h1>Nuro is: </h1>
  <ul class="list">
    <li>Fun</li>
    <li>Easy to learn</li>
  </ul>
</div>
```
You can also use state/props in your method:
```js
class MyComponent {
  items = ['Fun', 'Easy to learn']
  render(h) {
    return h('div', {id: 'app'}, [
      h('h1', {}, [this.props.title]),
      h('ul', {class: 'list'}, this.items.map(item => {
        return h('li', {}, item)
      }))
    ])
  }
}
Nuro.mount(MyComponent, element, {title: 'Nuro is: '})
```
All templates are automatically compiled to render methods behind the scenes when a component is mounted for the first time. `<div>{{foo}}</div>` --> `return h('div', {}, this.foo)`  

Render methods are the most flexible way to implement components since you have the full power of JavaScript. If there is some logic that is awkward to represent as a template (such as dynamic tag names) you may want to use render methods instead. However, they tend to be tedious to write and hard to read for large components. 

## Nested Components
To include components inside other components, use the `includes` object:
```js
class ChildComponent { 
  $template = `<p>Child component</p>` 
}
class ParentComponent {
  $template = `
    <div>
      <p>Child content below...</p>
      <child-component></child-component>
    </div>
  `
  $includes = {
    'child-component': ChildComponent
  }
}
Nuro.mount(ParentComponent)
```
Nuro is smart enough to convert PascalCase to kebab-case so you can also use the shorthand:
```js
$includes = {
  ChildComponent
}
```
Or register a component globally so it can be included in all other components in your app:
```js
Nuro.include('my-button', class {
  $template = `<button class="my-button">{{props.text}}</button>`
})
```

## Lifecycle Hooks
To implement a lifecycle hook, just define a method on the component with the correct name. 
```js
class App {
  text = 'Fetching...'
  $template = `<div>{{text}}</div>`
  async afterMount() {
    let response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    let json = await response.json()
    this.text = json.title
  }
}
Nuro.mount(App)
```
Each hook is listed below:
1. `beforeInit` - After the component instance is created but before reactivity is added
2. `beforeMount` - Component is fully set up but has not been mounted to the DOM
3. `beforeRender` - Before every render
4. `render` - Called for each update to produce the new virtual DOM tree
5. `afterRender` - After the DOM is updated
6. `afterMount` - After initial render to the DOM
7. `beforeUnmount` - Before the component is removed from the DOM
8. `afterUnmount` - After the component is removed

## License
[MIT](https://github.com/jegan321/nuro/blob/master/LICENSE)