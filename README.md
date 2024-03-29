# Nuro

Nuro is a reactive, component-based JavaScript framework which can be used as a lighter and simpler alternative to frameworks like React or Vue.

```js
import { Nuro } from 'nuro'

class App {
  name = 'world'
  template = `
    <div id="app">
      Name: <input $bind="name"/> 
      Hello, {{name}}!
    </div>
  `
}

Nuro.mount(App)
```

## Goals
* Lightweight (3.5kb minified and gzipped)
* Zero dependencies
* Easy to learn and simple to use
* Can be used for your entire application or sprinkled in
* No build step required

## Features
* Class based components without importing the framework
* Powerful template syntax
* UI automatically updates when data changes
* Updates only the DOM elements that have changed
* Event handling
* Automatically encodes HTML from users to prevent script injection

## Installation
Nuro can be downloaded from npm or the dist directory of this repository.

Install using npm:
```bash
npm install nuro
```

Import as an ES Module:
```js
import { Nuro } from 'nuro'
Nuro.mount(MyApp)
```

Using Nuro doesn't require a build step so the library can also be included in a simple HTML page:
```html
<script type="module">
  import { Nuro } from 'path/to/nuro.js'
  Nuro.mount(MyApp)
</script>
```

Or use the UMD version:
```html
<script src="path/to/nuro.umd.js"></script>
<script>
  Nuro.mount(MyApp)
</script>
```
  
# Documentation

## Components
Components are defined using JavaScript classes:
```js
class MyComponent { 
  template = `<div id="app">Hello, world</div>` 
}
```
Component classes don't require any base class to be extended or functions to be imported. Just add a template and any lifecycle hooks you need and pass it to `Nuro.mount()`. Nuro will instantiate an instance of your component, compile the template and call any hooks automatically.

## Mounting
Mounting will render the initial version of your UI using the default state of the component. By default your component will be mounted on a new element which is automatically appended to the body of the page:
```js
Nuro.mount(MyComponent)
```
If you want to mount on a specific element instead, you can provide the element as the second argument:
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
  template = `<p>Hello, {{props.name}}</p>`
}
Nuro.mount(Greeter, document.querySelector('#app'), { name: 'world' })
```

## State
State is data that can be stored in your component and persist between renders. Getting and setting state is extremely easy. Just set a property on your component and then it can be referenced by name in your template:
```js
class App {
  msg = "My state variable"
  template = `<div>{{msg}}</div>`
}
Nuro.mount(App)
```

## Reactivity
Changing state or props on a component instance will automatically trigger a re-render. The mount function always returns the instance of the component that was created. You can then change any properties you want and the UI will be updated accordingly. 
```js
class Status {
  text = 'Waiting...'
  template = `<p>{{text}}</p>`
}
let status = Nuro.mount(Status)
setTimeout(() => status.text = 'Done!', 1000)
```

## Events
Component state can also be changed internally using event handlers. Just add an attribute with '@' and an event type and set the value to a function:
```js
class Clicker {
  count = 0
  template = `<button @click="increment">Clicked {{count}} times</button>`
  increment() {
    this.count++
  }
}
```
## Attribute binding
HTML attributes can be bound to a JavaScript variable by putting a colon in front of the attribute name. This is essentially a shorthand for having an attribute value with a curly braces expression.
```js
class Hello {
  myID = 'my-id'
  custom = 'Custom attribute data...'
  template = `
    <div :id="myID" :data-custom="custom">
      Hello
    </div>
  `
}
```
Which is equivalent to:
```js
class Hello {
  myID = 'my-id'
  custom = 'Custom attribute data...'
  template = `
    <div id="{{myID}}" data-custom="{{custom}}">
      Hello
    </div>
  `
}
```

## Template Directives
Template directives are special HTML attributes that add dynamic behavior, such as if statements and loops.

## $if directive
Only renders the element if the condition is truthy
```js
class Peekaboo {
  show = false
  template = `
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
  template = `
    <div>
      <h1>Todo List</h1>
      <ul>
        <li $for="task in tasks">{{task}}</li>
      </ul>
    </div>
  `
}
```

## $bind directive
Used for two-way binding of form inputs. When the UI changes the data property changes and vice versa. Works with inputs, textareas and select elements.
```js
class UserForm {
  name = ''
  admin = false
  template = `
    <form @submit="handleSubmit">
      <label>Name: </label>
      <input $bind="name"><br>
      <label>Is admin: </label>
      <input type="checkbox" $bind="admin"><br>
      <input type="submit">
    </form>
  `
  handleSubmit(e) {
    e.preventDefault()
    alert(`Name: ${this.name}, Admin: ${this.admin}`)
  }
}
```

## $class directive
Used to easily toggle classes on and off. The value is an object where the property names are the classes to toggle and the property values are whether the class should be rendered or not.
```js
class ActivateButton {
  selected = false
  template = `
    <button $class="{active: selected}" @click="()=>selected=true">
      Activate
    </button>
  `
}
```

## $attrs directive
Used to merge props from an object onto an element or component
```js
class Example {
  myProps = {
    id: 'my-id',
    class: 'important'
  }
  template = `
    <div $attrs="myProps">
      Example
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
To include components inside other components, use an `includes` object:
```js
class ChildComponent { 
  template = `<p>Child component</p>` 
}
class ParentComponent {
  template = `
    <div>
      <p>Child content below...</p>
      <child-component></child-component>
    </div>
  `
  includes = {
    'child-component': ChildComponent
  }
}
Nuro.mount(ParentComponent)
```
Nuro is smart enough to convert PascalCase to kebab-case so you can also use the shorthand:
```js
includes = {
  ChildComponent
}
```
Or register a component globally so it can be included in all other components in your app:
```js
Nuro.register('my-button', class {
  template = `<button class="my-button">{{props.text}}</button>`
})
```

## Passing Props to Nested Components
Use props to pass data from a parent component to a child component
```js
class ChildComponent { 
  template = `<p>Data from parent: {{props.foo}}</p>` 
}
class ParentComponent {
  template = `
    <div>
      <p>Child content below...</p>
      <child-component foo="Hello!"></child-component>
    </div>
  `
  includes = {
    'child-component': ChildComponent
  }
}
Nuro.mount(ParentComponent)
```

## Slots
A slot is a placeholder element for other DOM content that is passed in by the parent component. This allows a parent component to pass HTML template code to a child component instead of just JavaScript variables like props.
```js
class PictureFrame {
  template = `
    <div class="frame">
      <slot></slot>
    </div>
  `
}
class Gallery {
  template = `
    <div>
      <picture-frame>
        <img src="photo1.jpg"/>
      </picture-frame>
      <picture-frame>
        <img src="photo2.jpg"/>
      </picture-frame>
    </div>
  `
  includes = {
    PictureFrame
  }
}
Nuro.mount(Gallery)
```

## Lifecycle Hooks
To implement a lifecycle hook, just define a method on the component with the correct name. 
```js
class App {
  text = 'Fetching...'
  template = `<div>{{text}}</div>`
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
4. `afterRender` - After every render
5. `afterMount` - After initial render to the DOM
6. `beforeUnmount` - Before the component is removed from the DOM

## TypeScript Support
```ts
import { Nuro, Component, CreateElement } from 'nuro'

interface MyProps {
  id: number
  message: string
}

class MyComponent extends Component<MyProps> {
  render(h: CreateElement) {
    return h('p', { 'data-message-id': this.props.id }, [
      this.props.message 
    ])
  }
}

Nuro.mount(MyComponent, element, {
  id: 1,
  message: 'Hello, world'
})
```

## Contributing
Pull requests and feedback are welcome. If you find a bug please create an issue.

## License
[MIT](https://github.com/jegan321/nuro/blob/master/LICENSE)