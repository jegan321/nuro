import { mountRootComponent, unmountComponent } from './components/component-handler.js'
import { compileTemplate } from './components/template-compiler.js'
import { include } from './components/includes.js'
import { GlobalAPI } from './api/global-api.js'
import { installPlugin } from './components/plugins.js'
import { addMixin } from './components/mixins.js'
import { CreateElement } from './api/create-element'
import { UserComponent, ComponentClass } from './api/component'
import { ComponentProxy } from './api/component-proxy'
import { Plugin } from './api/plugin'
import { VNode } from './api/vnode'

let globalAPI: GlobalAPI = {
  mount: mountRootComponent,
  unmount: unmountComponent,
  compileTemplate: compileTemplate,
  include: include,
  mixin: addMixin,
  install: installPlugin
}

export {
  globalAPI as Nuro,
  GlobalAPI,
  CreateElement,
  UserComponent as Component,
  ComponentClass,
  ComponentProxy,
  Plugin,
  VNode
}
