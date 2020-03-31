/**
 * Call a lifecycle hook function if it exists
 * @param {Component} component
 * @param {String} hookName
 * @param  {...any} rest
 */
export function callHook(component, hookName, ...rest) {
  let hooks = component.__ctx.hooks
  if (hooks) {
    let hook = hooks[hookName]
    if (hook) {
      hook.call(component, ...rest)
    }
  }
}
