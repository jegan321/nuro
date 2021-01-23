import { Component, ComponentClass, Render } from '../api/component'
import { createElementFactory } from './create-element'
import { DiffEngine } from '../dom/diff-engine'
import { DomPatcher } from '../dom/dom-patcher'
import {
  deleteNodeContext,
  getComponentProxy,
  hasComponentProxy,
  setComponentProxy
} from '../dom/node-context'
import { proxyHandler } from './component-proxy'
import { getMethodNames } from '../util/object-utils'
import { VNode } from '../api/vnode'
import { callHook } from './hooks'
import { mapVNode } from '../dom/map-vnode'
import { NuroError } from '../util/nuro-error'
import { compileTemplate } from './template-compiler'
import { globalIncludes } from './includes'
import { camelCaseToKebabCase } from '../util/string-utils'
import { applyMixins } from './mixins'

let domPatcher = new DomPatcher(mountComponent, unmountComponent, setProps)

export function mountRootComponent(
  ComponentClass: new () => Component,
  element?: Element,
  props: Record<string, any> = {}
): Component {
  if (!element) {
    element = domPatcher.createElementInBody('div')
  }
  let vOldNode = mapVNode(element)
  let newNode = mountComponent(ComponentClass, element, props, [], vOldNode)
  return getComponentProxy(newNode)
}

export function mountComponent(
  ComponentClass: ComponentClass,
  element: Element,
  props: Record<string, any>,
  children: VNode[],
  vOldNode: VNode
): Element {
  let component = new ComponentClass()

  callHook(component, 'beforeInit')

  applyMixins(component)

  let classIncludes = ComponentClass.includes || {}
  component.$includes = getComponentIncludes(classIncludes, globalIncludes)

  if (!component.render) {
    if (ComponentClass.template) {
      let renderMethodCode = compileTemplate(ComponentClass.template)
      component.render = new Function('h', renderMethodCode) as Render
    } else {
      throw new NuroError(
        'Either a render method or a static template string is required in a component class'
      )
    }
  }

  component.$update = function() {
    updateComponent(component)
  }
  component.$element = element
  component.$vnode = vOldNode

  component.props = props
  component.props.children = children

  let componentProxy = new Proxy(component, proxyHandler)
  bindAllMethods(component, componentProxy, ComponentClass)

  callHook(componentProxy, 'beforeMount')

  updateComponent(component)

  callHook(componentProxy, 'afterMount')

  setComponentProxy(component.$element, componentProxy)

  return component.$element
}

/**
 * Make component names lower case and remove dashes
 */
function getComponentIncludes(
  classIncludes: Record<string, ComponentClass>,
  globalIncludes: Map<string, ComponentClass>
): Map<string, ComponentClass> {
  let includes = new Map<string, ComponentClass>([...globalIncludes])
  for (let originalName in classIncludes) {
    let componentClass = classIncludes[originalName]
    let kebabName = camelCaseToKebabCase(originalName)
    includes.set(originalName, componentClass)
    includes.set(kebabName, componentClass)
  }
  return includes
}

function bindAllMethods(
  component: Component,
  componentProxy: Component,
  ComponentClass: new () => Component
) {
  getMethodNames(ComponentClass).forEach(method => {
    component[method] = component[method].bind(componentProxy)
  })
}

export function unmountComponent(element: Element): boolean {
  if (element != null && hasComponentProxy(element)) {
    let component = getComponentProxy(element)
    callHook(component, 'beforeUnmount')
    deleteNodeContext(element)
    callHook(component, 'afterUnmount')
    return true
  } else {
    return false
  }
}

export function updateComponent(component: Component): Component {
  callHook(component, 'beforeRender')

  let createElement = createElementFactory(component.$includes)

  let newVNode = component.render(createElement)
  if (!newVNode.nodeType) {
    throw new NuroError('Component render method did not return VNode')
  }
  let diffEngine = new DiffEngine(domPatcher)
  let newNode = diffEngine.reconcile(component.$element, component.$vnode, newVNode)

  callHook(component, 'afterRender')

  component.$vnode = newVNode
  component.$element = newNode

  return component
}

function setProps(node: Element, props: Record<string, any>): Element {
  let componentProxy = getComponentProxy(node)
  componentProxy.props = props
  return node
}
