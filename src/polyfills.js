export function polyfills() {
  // Polyfill for Element.matches()
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector
  }
}
