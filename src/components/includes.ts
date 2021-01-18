import { NuroError } from '../util/nuro-error'
import { ComponentClass } from './component'

export const globalIncludes = new Map<string, ComponentClass>()

export function include(componentName: string, ComponentClass: ComponentClass): void {
  globalIncludes.set(componentName, ComponentClass)
}
