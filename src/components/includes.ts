import { ComponentClass } from '../api/component.js'
import { Nuro } from '../index.js'
import { camelCaseToKebabCase } from '../util/string-utils.js'

export const globalIncludes = new Map<string, ComponentClass>()

export function include(componentName: string, ComponentClass: ComponentClass): void {
  globalIncludes.set(camelCaseToKebabCase(componentName), ComponentClass)
}
