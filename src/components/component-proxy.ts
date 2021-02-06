import { ComponentProxy } from '../api/component-proxy.js'
import { isObject, isArray } from '../util/object-utils.js'

interface NestedState {
  [state: string]: any
  $component: ComponentProxy
}

type ProxiedObject = NestedState | ComponentProxy

export const proxyHandler: ProxyHandler<ComponentProxy> = {
  get: handleGet,
  set: handleSet,
  deleteProperty: handleDelete
}

function handleGet(obj: ProxiedObject, prop: string): unknown {
  let val = obj[prop]
  if (isObject(val) || isArray(val)) {
    // If obj is the props object, don't wrap in Proxy
    if (prop === 'props' && !obj.$component) {
      return val
    }

    // Pass on the ref to component to nested state
    val.$component = getComponent(obj)
    if (isArray(val)) {
      // Pass on the node and vnode objects to each object in array
      val.forEach((element: ProxiedObject) => {
        if (isObject(element)) {
          element.$component = getComponent(obj)
        }
      })
    }
    return new Proxy(val, proxyHandler)
  } else {
    return obj[prop]
  }
}

function handleSet(obj: ComponentProxy, prop: string, value: any): boolean {
  obj[prop] = value
  let component = getComponent(obj)
  if (prop === 'props') {
    component.$vnode.attrs = value
  }
  component.$update()
  return true
}

function handleDelete(obj: ComponentProxy, prop: string): boolean {
  delete obj[prop]
  let component = getComponent(obj)
  component.$update()
  return true
}

function getComponent(obj: ProxiedObject): ComponentProxy {
  return obj.$component != null ? obj.$component : obj
}
