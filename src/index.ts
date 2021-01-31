import { mountRootComponent, unmountComponent } from './components/component-handler.js'
import { compileTemplate } from './components/template-compiler.js'
import { include } from './components/includes.js'
import { GlobalAPI } from './api/global-api.js'
import { installPlugin } from './components/plugins.js'
import { addMixin } from './components/mixins.js'

let globalAPI: GlobalAPI = {
  mount: mountRootComponent,
  unmount: unmountComponent,
  compileTemplate: compileTemplate,
  include: include,
  mixin: addMixin,
  install: installPlugin
}

export default globalAPI
