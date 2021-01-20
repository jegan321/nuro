import { mountRootComponent, unmountComponent } from './components/component-handler'
import { compileTemplate } from './components/template-compiler'
import { include } from './components/includes'
import { GlobalAPI } from './api/global-api'
import { installPlugin } from './components/plugins'
import { addMixin } from './components/mixins'

let globalAPI: GlobalAPI = {
  mount: mountRootComponent,
  unmount: unmountComponent,
  compileTemplate: compileTemplate,
  include: include,
  mixin: addMixin,
  install: installPlugin
}

export default globalAPI
