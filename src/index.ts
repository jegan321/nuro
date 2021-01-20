import { mountRootComponent, unmountComponent } from './components/component-handler'
import { compileTemplate } from './components/template-compiler'
import { include } from './components/includes'
import { Nuro } from './api/nuro'
import { installPlugin } from './components/plugins'

let nuro: Nuro = {
  mount: mountRootComponent,
  unmount: unmountComponent,
  compileTemplate: compileTemplate,
  include: include,
  install: installPlugin
}

export default nuro
