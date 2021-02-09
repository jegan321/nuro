let Nuro = require('../../build/dist/nuro')
let compileTemplate = Nuro.compileTemplate

test('should take all attributes from object literal', () => {
  let code = compileTemplate('<div $attrs="{id: 123}"></div>')
  expect(code)
  .toEqual("with(this){return h('div',{...{},...{id: 123},...{class:({}.class?({}.class+' '+({id: 123}.class||'')).trim():{id: 123}.class)}})}")
})

test('should take all attributes from props', () => {
  let code = compileTemplate('<div $attrs="props"></div>')
  expect(code)
  .toEqual("with(this){return h('div',{...{},...props,...{class:({}.class?({}.class+' '+(props.class||'')).trim():props.class)}})}")
})

test('should use some hard coded attribues and rest from props', () => {
  let code = compileTemplate('<div id="123" class="my-class" $attrs="props"></div>')
  expect(code)
  .toEqual("with(this){return h('div',{...{'id':'123','class':'my-class'},...props,...{class:({'id':'123','class':'my-class'}.class?({'id':'123','class':'my-class'}.class+' '+(props.class||'')).trim():props.class)}})}")
})