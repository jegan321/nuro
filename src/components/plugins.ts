import { Nuro } from '../api/nuro'
import { Plugin } from '../api/plugin'

const installedPlugins: Array<Plugin> = []

export function installPlugin(this: Nuro, plugin: Plugin, options: Record<string, unknown>): void {
  if (!installedPlugins.includes(plugin)) {
    plugin.install(this, options)
    installedPlugins.push(plugin)
  }
}
