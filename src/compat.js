// Small runtime compatibility layer for older iPadOS Safari releases.
// Vite handles syntax transforms; these helpers cover standard APIs that are
// not syntax-transformed and otherwise stop React before the first render.

if (typeof Object.hasOwn !== 'function') {
  Object.defineProperty(Object, 'hasOwn', {
    configurable: true,
    writable: true,
    value(object, property) {
      return Object.prototype.hasOwnProperty.call(Object(object), property)
    },
  })
}

if (typeof Object.fromEntries !== 'function') {
  Object.defineProperty(Object, 'fromEntries', {
    configurable: true,
    writable: true,
    value(iterable) {
      const result = {}
      for (const entry of iterable) {
        if (!entry || entry.length < 2) throw new TypeError('Iterator value is not an entry object')
        result[entry[0]] = entry[1]
      }
      return result
    },
  })
}

if (typeof Array.prototype.at !== 'function') {
  Object.defineProperty(Array.prototype, 'at', {
    configurable: true,
    writable: true,
    value(index) {
      const length = this.length >>> 0
      const integer = Number(index) || 0
      const position = integer < 0 ? length + Math.ceil(integer) : Math.floor(integer)
      return position < 0 || position >= length ? undefined : this[position]
    },
  })
}

if (typeof String.prototype.replaceAll !== 'function') {
  Object.defineProperty(String.prototype, 'replaceAll', {
    configurable: true,
    writable: true,
    value(search, replacement) {
      if (search instanceof RegExp) {
        if (!search.global) throw new TypeError('replaceAll requires a global regular expression')
        return String(this).replace(search, replacement)
      }
      return String(this).split(String(search)).join(String(replacement))
    },
  })
}

if (typeof window.queueMicrotask !== 'function') {
  window.queueMicrotask = callback => Promise.resolve()
    .then(callback)
    .catch(error => window.setTimeout(() => { throw error }, 0))
}

// iPad Safari keeps a persistent :hover/:focus state after taps and older
// releases have unreliable 3D backface compositing. CSS uses this class to
// swap flip-card faces in 2D on touch hardware while desktop keeps the full
// animated treatment.
if ('ontouchstart' in window || Number(window.navigator?.maxTouchPoints || 0) > 0) {
  document.documentElement.classList.add('spp-touch-ui')
}
