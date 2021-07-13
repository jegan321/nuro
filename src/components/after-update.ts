import { isUpdatePending } from './pending-update-tracker'

export function afterDomUpdate(): Promise<void> {
  return new Promise(resolve => {
    waitForPendingUpdatesToComplete(resolve)
  })
}

function waitForPendingUpdatesToComplete(resolve: (value: void | PromiseLike<void>) => void) {
  requestAnimationFrame(() => {
    if (isUpdatePending()) {
      waitForPendingUpdatesToComplete(resolve)
    } else {
      resolve()
    }
  })
}
