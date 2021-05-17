let Nuro = require('../../dist/nuro.umd.js')

test('test safe HTML encoding', () => {

  class TestComponent {
    html = '<p id="unsafe">foo</p>'
    render($) {
      return $('div', {id: 'app'}, this.html)
    }
  }
  Nuro.mount(TestComponent)

  expect(document.getElementById('app').outerHTML)
    .toEqual(`<div id=\"app\">&lt;p id=\"unsafe\"&gt;foo&lt;/p&gt;</div>`)
})