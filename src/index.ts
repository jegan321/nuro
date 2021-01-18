import { mountRootComponent, unmountComponent } from './components/component-handler'
import { compileTemplate } from './components/template-compiler'
import { include } from './components/includes'

export default {
  mount: mountRootComponent,
  unmount: unmountComponent,
  compileTemplate: compileTemplate,
  include: include
}
