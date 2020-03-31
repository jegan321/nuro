import { merge, clone, getType, handleError } from './utils'
import { parseDomNode } from './parse-dom'
import { diff } from './diff'
import { buildVNode } from './build-vnode'
import { addSlotContent } from './slots'
import { callHook } from './hooks'
import { compile } from './compiler'
import { createElement, createElementList } from './render-helpers'
import { getGlobalComponents } from './global-components'

export class Component {
  // TODO: change name to definition
  static _build(name, config, cid, originalArgs = {}) {
    let instance = new Component()

    instance.name = name

    instance.args = originalArgs

    config = clone(config)

    let methods = config.methods || {}
    // Bind each method to the component instance it was
    // defined in. This lets methods be passed to child components
    // but still keep the "this" of the component where the
    // method was defined
    for (let method in methods) {
      methods[method] = methods[method].bind(instance)
    }
    merge(instance, methods)
    delete config.methods

    let data = config.data || {}
    if (getType(data) === 'function') {
      data = data.call(instance)
    }
    merge(instance, data)
    delete config.data

    // Add the rest of the config properties to the __ctx object to keep them
    // separate from properties the user should use
    instance.__ctx = config

    instance.__ctx.cid = cid
    instance.__ctx.template = config.template
    instance.__ctx.components = instance.__ctx.components || {}
    merge(instance.__ctx.components, getGlobalComponents())

    normalizeComponentNames(instance.__ctx.components)

    if (config.render) {
      // Render function provided
      instance.__ctx.render = config.render
    } else if (config.template) {
      // Template string provided

      // Build virtual DOM node based on the template string
      let templateDomNode = parseDomNode(config.template)
      let templateVNode = buildVNode(templateDomNode)

      // Remove nuro-template attribute so the rendered output won't be
      // hidden by the CSS rule
      if (templateVNode.attrs.hasOwnProperty('nuro-template')) {
        delete templateVNode.attrs['nuro-template']
      }

      // Compile template DOM to render function
      let renderCode = compile(templateVNode)
      // console.log('\n' + renderCode)
      instance.__ctx.render = new Function('$', '$li', renderCode)
    } else {
      handleError('No template or render property provided')
    }

    callHook(instance, 'afterCreate')

    return instance
  }

  static addInstance(componentName, componentDefinition) {
    if (!Component.instanceMap[componentName]) {
      Component.instanceMap[componentName] = []
    }
    let instances = Component.instanceMap[componentName]
    let currrentLength = instances.length
    let cid = componentName + '-' + currrentLength
    let uninitializedDef = clone(componentDefinition)
    uninitializedDef.__unitialized = true
    instances.push(uninitializedDef)
    return cid
  }

  static getInstance(cid, originalArgs) {
    if (cid) {
      let split = cid.split('-')
      let index = parseInt(split[split.length - 1])
      let name = cid.replace('-' + index, '')
      let map = Component.instanceMap
      if (map[name] && map[name][index]) {
        if (map[name][index].__unitialized) {
          map[name][index] = Component._build(map[name][index], cid, originalArgs)
        }
        return map[name][index]
      } else {
        handleError("Attempted to get an instance of a component that hasn't been added yet")
      }
    }
  }
}

/**
 * Updates the data object and re-renders the UI
 * @param {Object} newData   An object containing data to add to the Nuro.data object.
 */
Component.prototype.update = function(newData) {
  callHook(this, 'beforeUpdate', newData)
  merge(this, newData, true)
  this.mount(this.__ctx.rootNode)
  callHook(this, 'afterUpdate', newData)
}

/**
 * Update the DOM by creating two virtual nodes, diffing them and patching
 * the DOM efficiently
 * @param {Nuro} self instance of Nuro
 */
Component.prototype.mount = function(node, args, slotContent) {
  // Handle case where node is a selector string
  if (getType(node) === 'string') {
    let selector = node
    node = document.querySelector(selector)
    if (!node) {
      handleError('Unable to find element with selector: ' + selector)
      return
    }
  }

  // Create a virtual DOM based on the existing root
  let vOldNode = buildVNode(node)

  if (args) {
    this.args = args || {}
  }

  let ctx = this.__ctx

  // After adding ctx param
  let $ = function (tag, options, children) {
    return createElement(ctx, tag, options, children)
  }
  let $li = function (val, render) {
    return createElementList(val, render)
  }

  // Call the render function with the latest data to generate
  // the new virtual DOM. This is how the DOM is supposed to look
  let vNewNode = this.__ctx.render.call(this, $, $li)

  // Handle slots
  // TODO: cid doesn't exist anymore
  if (this.__ctx.cid !== '__root__-0') {
    vNewNode.children = addSlotContent(vNewNode.children, slotContent)
  }

  // Diff the two virtual nodes and generate a patch function
  // for efficient DOM updates
  // TODO: circular dependency between component.js and diff.js
  let patch = diff(vOldNode, vNewNode, Component._build)

  // Make the changes to the DOM
  this.__ctx.rootNode = patch(node)


  this.__ctx.rootNode._nuro.componentName = this.name
  this.__ctx.rootNode._nuro.componentInstance = this

  return this.__ctx.rootNode
}

// Make component names lower case and remove dashes
function normalizeComponentNames(components) {
  for (let key in components) {
    let normalizedName = key.toLowerCase().replace('-', '')
    if (normalizedName !== key) {
      components[normalizedName] = components[key]
      delete components[key]
    }
  }
}

Component.instanceMap = {}
