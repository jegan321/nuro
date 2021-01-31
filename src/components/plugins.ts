import { GlobalAPI } from '../api/global-api.js'
import { Plugin } from '../api/plugin.js'

const installedPlugins: Array<Plugin> = []

export function installPlugin(
  this: GlobalAPI,
  plugin: Plugin,
  options: Record<string, unknown>
): void {
  if (!installedPlugins.includes(plugin)) {
    plugin.install(this, options)
    installedPlugins.push(plugin)
  }
}
