/**
 * Converts a camel case string to kebab case:
 * myStringValue -> my-string-value
 */
export function camelCaseToKebabCase(camelCase: string): string {
  // Map each character
  return camelCase
    .split('')
    .map((char, i) => {
      // If char is upper case
      if (char === char.toUpperCase()) {
        // Make it lower case and also add a hyphen if it is not the first char
        if (i === 0) {
          return char.toLowerCase()
        } else {
          return '-' + char.toLowerCase()
        }
      } else {
        // Else return the lower case char
        return char
      }
    })
    .join('')
}
