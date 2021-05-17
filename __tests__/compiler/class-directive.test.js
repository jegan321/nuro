let Nuro = require('../../dist/nuro.umd.js')
let compileTemplate = Nuro.compileTemplate

test('should leave static class alone', () => {
  let code = compileTemplate('<div class="static"></div>')
  expect(code)
  .toEqual("with(this){return h('div',{'class':'static'})}")
})

test('should add dynamic class', () => {
  let code = compileTemplate('<div $class="{dyn1: true}" class="static"></div>')
  expect(code)
  .toEqual(`with(this){return h('div',{'class':Object.entries({dyn1: true}).reduce((prevC,c)=>c[1]?prevC+=" "+c[0]:prevC,'static').trim()})}`)
})

test('should compile with multiple dyanmic classes', () => {
  let code = compileTemplate('<div $class="{dyn1: true, dyn2: false, dyn3: true}" class="static"></div>')
  expect(code)
  .toEqual(`with(this){return h('div',{'class':Object.entries({dyn1: true, dyn2: false, dyn3: true}).reduce((prevC,c)=>c[1]?prevC+=" "+c[0]:prevC,'static').trim()})}`)
})

test('should compile dynamic classes without any static class', () => {
  let code = compileTemplate('<div $class="{dyn1: true}"></div>')
  expect(code)
  .toEqual(`with(this){return h('div',{'class':Object.entries({dyn1: true}).reduce((prevC,c)=>c[1]?prevC+=" "+c[0]:prevC,'').trim()})}`)
})

test('should compile with variable instead of object literal', () => {
  let code = compileTemplate('<div $class="classes"></div>')
  expect(code)
  .toEqual(`with(this){return h('div',{'class':Object.entries(classes).reduce((prevC,c)=>c[1]?prevC+=" "+c[0]:prevC,'').trim()})}`)
})

test('should compile when class has expessions', () => {
  let code = compileTemplate('<div $class="{dyn1: true}" class="static {{foo}}"></div>')
  expect(code)
  .toEqual(`with(this){return h('div',{'class':Object.entries({dyn1: true}).reduce((prevC,c)=>c[1]?prevC+=" "+c[0]:prevC,'static '+(foo)).trim()})}`)
})

test('should compile when class is bound to component property', () => {
  let code = compileTemplate('<div $class="{dyn1: true}" :class="myClass"></div>')
  expect(code)
  .toEqual(`with(this){return h('div',{'class':Object.entries({dyn1: true}).reduce((prevC,c)=>c[1]?prevC+=" "+c[0]:prevC,myClass).trim()})}`)
})

test('should compile nested $class elements', () => {
  let code = compileTemplate('<div $class="{dyn1: true}" class="static"><div $class="{dyn1: true, dyn2: true}" class="static static2"></div></div>')
  expect(code)
  .toEqual(`with(this){return h('div',{'class':Object.entries({dyn1: true}).reduce((prevC,c)=>c[1]?prevC+=" "+c[0]:prevC,'static').trim()},[h('div',{'class':Object.entries({dyn1: true, dyn2: true}).reduce((prevC,c)=>c[1]?prevC+=" "+c[0]:prevC,'static static2').trim()})])}`)
})