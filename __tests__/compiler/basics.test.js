let Nuro = require('../../build/dist/nuro')
let compileTemplate = Nuro.compileTemplate

test('should compile div with no attrs or children', () => {
  let code = compileTemplate('<div></div>')
  expect(code)
  .toEqual("with(this){return h('div',{})}")
})

test('should compile with hard coded text', () => {
  let code = compileTemplate('<div>Hello</div>')
  expect(code)
  .toEqual("with(this){return h('div',{},['Hello'])}")
})

test('should compile with children', () => {
  let code = compileTemplate('<div><div></div><div></div></div>')
  expect(code)
  .toEqual("with(this){return h('div',{},[h('div',{}),h('div',{})])}")
})

test('should compile with class attribute', () => {
  let code = compileTemplate('<div class="my-div"></div>')
  expect(code)
  .toEqual("with(this){return h('div',{'class':'my-div'})}")
})

test('should compile with multiple attributes', () => {
  let code = compileTemplate('<div id="my-id" data-thing="thing"></div>')
  expect(code)
  .toEqual("with(this){return h('div',{'id':'my-id','data-thing':'thing'})}")
})

test('should compile template with white space and ignore all blank text nodes', () => {
  let code = compileTemplate(`

    <div id="my-id">
      <p>Hello</p>
      <ul>
        <li> one </li>

        <li> two </li>
      </ul>
    </div>
  `)
  expect(code)
  .toEqual("with(this){return h('div',{'id':'my-id'},[h('p',{},['Hello']),h('ul',{},[h('li',{},[' one ']),h('li',{},[' two '])])])}")
})