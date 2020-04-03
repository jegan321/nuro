import { getType } from './utils'

// TODO: since I'm hardcoding events I can get rid of the Set that stores
// the evenrts that are in the templates
// TOD: add more events or change it back to getting events from the templates
const eventTypes = ['click', 'input', 'submit', 'keydown']

/**
 * Adds an event listener for every supported event. The listener will
 * check if the target has _nuro.events.<type> for the event type. If
 * it does and the value is a function, execute that function.
 *
 */
export function addEventListeners() {
  eventTypes.forEach(type => {
    document.addEventListener(type, event => {
      let _nuro = event.target._nuro
      if (_nuro && _nuro.events) {
        let handler = _nuro.events[type]
        if (handler) {
          if (getType(handler) === 'function') {
            handler(event)
          }
        }
      }
    })
  })
}
