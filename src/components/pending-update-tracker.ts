let updateIsPending = false

export function setPendingUpdateFlag(newValue: boolean) {
  updateIsPending = newValue
}

export function isUpdatePending() {
  return updateIsPending
}
