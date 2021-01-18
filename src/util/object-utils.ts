/**
 * Holder for two generic values
 */
interface Pair<T, V> {
  left: T
  right: V
}

/**
 * Creates a new array made up of pairs. Each pair is the element from each
 * array at that index.
 *
 * For example, index 1 is xs[1] and ys[1], index 2 is xs[2] and ys[2], etc.
 *
 * If they have different lengths, the new array will
 * be the length of the shortest one.
 */
export function zip<T, V>(xs: ArrayLike<T>, ys: ArrayLike<V>): Pair<T, V>[] {
  const zipped = []
  for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
    let pair = {
      left: xs[i],
      right: ys[i]
    }
    zipped.push(pair)
  }
  return zipped
}

export function getMethodNames(Class: new () => unknown): string[] {
  return Object.getOwnPropertyNames(Class.prototype).filter(x => x !== 'constructor')
}

export function isObject(val: unknown): boolean {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export function isFunction(val: unknown): boolean {
  return Object.prototype.toString.call(val) === '[object Function]'
}

export function isArray(val: unknown): boolean {
  return Array.isArray(val)
}
