import { mountRootComponent, unmountComponent } from './components/component-handler'
import { compileTemplate } from './components/template-compiler'
import { include } from './components/includes'
import { Nuro } from './api/nuro'

let nuro: Nuro = {
  mount: mountRootComponent,
  unmount: unmountComponent,
  compileTemplate: compileTemplate,
  include: include
}

export default nuro
