import { ComponentProxy } from '../components/component-proxy.js'
import { NuroError } from '../util/nuro-error.js'

interface NodeContext {
  eventHandlers: Record<string, EventListener>
  component?: ComponentProxy
}

type ElementWithNodeContext = Element & {
  _nuro?: NodeContext
}

/**
 * Gets the node context object inside DOM node and creates it
 * if it doesn't exist
 */
function getOrCreateNodeContext(node: ElementWithNodeContext): NodeContext {
  if (!node._nuro) {
    node._nuro = {
      eventHandlers: {}
    }
  }
  return node._nuro
}

export function setEventHandler(
  node: ElementWithNodeContext,
  eventType: string,
  handler: EventListener
): void {
  let nodeContext = getOrCreateNodeContext(node)
  let existingHandler = nodeContext.eventHandlers[eventType]
  if (existingHandler) {
    if (existingHandler !== handler) {
      node.removeEventListener(eventType, existingHandler)
      node.addEventListener(eventType, handler)
      nodeContext.eventHandlers[eventType] = handler
    }
  } else {
    node.addEventListener(eventType, handler)
    nodeContext.eventHandlers[eventType] = handler
  }
}

export function removeEventHandler(node: ElementWithNodeContext, eventType: string): void {
  let nodeContext = getOrCreateNodeContext(node)
  node.removeEventListener(eventType, nodeContext.eventHandlers[eventType])
  delete nodeContext.eventHandlers[eventType]
}

export function setComponentProxy(node: ElementWithNodeContext, componentProxy: ComponentProxy) {
  let nodeContext = getOrCreateNodeContext(node)
  nodeContext.component = componentProxy
}

export function getComponentProxy(node: ElementWithNodeContext): ComponentProxy {
  let nodeContext = getOrCreateNodeContext(node)
  if (nodeContext.component) {
    return nodeContext.component
  } else {
    throw new NuroError('Element does not have component inside context object')
  }
}

export function hasComponentProxy(node: ElementWithNodeContext): boolean {
  let nodeContext = getOrCreateNodeContext(node)
  return nodeContext.component != null
}

export function deleteNodeContext(node: ElementWithNodeContext): void {
  delete node._nuro
}
