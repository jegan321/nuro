import { ComponentClass } from '../api/component.js'
import { camelCaseToKebabCase } from '../util/string-utils.js'

export const globalIncludes = new Map<string, ComponentClass>()

export function register(componentName: string, ComponentClass: ComponentClass): void {
  globalIncludes.set(camelCaseToKebabCase(componentName), ComponentClass)
}
