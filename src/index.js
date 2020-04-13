import { hideTemplates } from './hide-templates'
import { addEventListeners } from './events'
import { Component } from './component'
import { handleError, clone, getType } from './utils'
import { addGlobalComponent } from './global-components'

hideTemplates()
addEventListeners()

let Nuro = {}

Nuro.create = function(definition) {
  definition = clone(definition)

  let rootNode
  if (definition.root) {
    if (getType(definition.root) === 'string') {
      rootNode = document.querySelector(definition.root)
    } else if (definition.root instanceof Element) {
      rootNode = definition.root
    }

    if (!rootNode) {
      handleError('Unable to find element with selector: ' + definition.root)
      return
    }

    // If template wasn't provided in constructor, get it from HTML
    if (!definition.template) {
      definition.template = rootNode.outerHTML
    }

    // Remove inner HTML before initial render
    rootNode.innerHTML = ''
  }

  // TODO: remove 'cid' everywhere
  let rootComponent = Component._build('__root__', definition, 'cid')

  // Initial render
  if (definition.root) {
    rootComponent.mount(rootNode)
  }

  return rootComponent
}

Nuro.register = addGlobalComponent

Nuro.plugin = function(plugin, options) {
  if (plugin.install) {
    plugin.install(Nuro, Component, options)
  } else {
    handleError("Plugin doesn't have install method")
  }
}

export default Nuro
