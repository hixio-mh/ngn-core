'use strict'

/**
 * @class NGN
 * @singleton
 */
/**
  * @method define
  * Create an object definition for a property.
  * For example:
  *
  * ```
  * Object.defineProperty('attr', NGN.define(true, false, true, 'value'))
  *
  * // The snippet above is the same as:
  * Object.defineProperty(this, 'attr', {
  *  enumberable: true,
  *  writable: false,
  *  configurable: true,
  *  value: 'value'
  * })
  * ```
  * @param  {boolean} enumerable
  * Determines if the attribute is considered an accessible part of the object.
  * Making an attribute enumerable will make it show up as a key in an object,
  * which can be iterated over (ex: `Object.keys()`). A non-enumerable asset is
  * treated as a private attribute.
  * @param  {boolean} writable
  * Determines whether the value can be changed.
  * @param  {boolean} configurable
  * Determines whether the attribute can be removed from the object.
  * @param  {any} value
  * The actual value of the attribute.
  * @private
  */
Object.defineProperty(NGN, 'define', {
  enumerable: false,
  writable: false,
  configurable: false,
  value: function (e, w, c, v) {
    return {
      enumerable: e,
      writable: w,
      configurable: c,
      value: v
    }
  }
})

Object.defineProperties(NGN, {
  /**
   * @method public
   * Create a `public` property definition for an object.
   * Example:
   *
   * ```
   * Object.defineProperty(this, 'attr', NGN.public('somevalue'))
   *
   * // Longhand equivalent
   * Object.defineProperty(this, 'attr', {
   *  enumerable: true,
   *  writable: true,
   *  configurable: false,
   *  value: 'somevalue'
   * })
   * ```
   * @param  {any} value
   * Any valid JavaScript value (function, boolean, number, string, etc)
   * used as the value for the object attribute.
   * @private
   */
  public: NGN.define(false, false, false, function (value) {
    return NGN.define(true, typeof value !== 'function', false, value)
  }),

  /**
   * @method private
   * Create a `private` property definition for an object.
   * Example:
   *
   * ```
   * Object.defineProperty(this, 'attr', NGN.private('somevalue'))
   *
   * // Longhand equivalent
   * Object.defineProperty(this, 'attr', {
   *  enumerable: false,
   *  writable: true,
   *  configurable: false,
   *  value: 'somevalue'
   * })
   * ```
   * @param  {any} value
   * Any valid JavaScript value (function, boolean, number, string, etc)
   * used as the value for the object attribute.
   * @private
   */
  private: NGN.define(false, false, false, function (value) {
    return NGN.define(false, typeof value !== 'function', false, value)
  }),

  /**
   * @method const
   * Create a `public` constant property definition for an object.
   * Example:
   *
   * ```
   * Object.defineProperty(this, 'attr', NGN.const('somevalue'))
   *
   * // Longhand equivalent
   * Object.defineProperty(this, 'attr', {
   *  enumerable: true,
   *  writable: false,
   *  configurable: false,
   *  value: 'somevalue'
   * })
   * ```
   * @param  {any} value
   * Any valid JavaScript value (function, boolean, number, string, etc)
   * used as the value for the object attribute.
   * @private
   */
  const: NGN.define(false, false, false, function (value) {
    return NGN.define(true, false, false, value)
  }),

  /**
   * @method privateconst
   * Create a `private` constant property definition for an object.
   * Example:
   *
   * ```
   * Object.defineProperty(this, 'attr', NGN.privateconst('somevalue'))
   *
   * // Longhand equivalent
   * Object.defineProperty(this, 'attr', {
   *  enumerable: false,
   *  writable: false,
   *  configurable: false,
   *  value: 'somevalue'
   * })
   * ```
   * @param  {any} value
   * Any valid JavaScript value (function, boolean, number, string, etc)
   * used as the value for the object attribute.
   * @private
   */
  privateconst: NGN.define(false, false, false, function (value) {
    return NGN.define(false, false, false, value)
  }),

  /**
   * @method get
   * Create a private `getter` property definition for an object.
   * Public getters are part of the ES2015 class spec.
   *
   * Example:
   *
   * ```
   * let myFunction = function () {
   *  return 'somevalue'
   * }
   *
   * // Longhand equivalent
   * Object.defineProperty(this, 'attr', {
   *  enumerable: false,
   *  get: function () {
   *    return 'somevalue'
   *  }
   * })
   * ```
   * @param  {function} fn
   * Any valid async JavaScript function with a `return` value.
   * @private
   */
  get: NGN.define(false, false, false, function (fn) {
    return {
      enumerable: false,
      get: fn
    }
  }),

  /**
   * @method get
   * Create a private `setter` property definition for an object.
   * Public setters are part of the ES2015 class spec.
   *
   * Example:
   *
   * ```
   * let myFunction = function () {
   *  return 'somevalue'
   * }
   *
   * // Longhand equivalent
   * Object.defineProperty(this, 'attr', {
   *  enumerable: false,
   *  set: function (value) {
   *    somethingElse = value
   *  }
   * })
   * ```
   * @param  {function} fn
   * Any valid async JavaScript function with a `return` value.
   * @private
   */
  set: NGN.define(false, false, false, function (fn) {
    return {
      enumerable: false,
      set: fn
    }
  })
})

Object.defineProperties(NGN, {
  /**
   * @method extend
   * Extend the NGN core object. Extending NGN is the equivalent of:
   *
   * Example:
   * ```
   * NGN.extend('greet', NGN.public(function (recipient) {
   *  return 'Hello, ' + recipient + '!'
   * }))
   *
   * // Equivalent of:
   *
   * Object.defineProperty(NGN, 'greet', {
   *  enumerable: true,
   *  writable: false,
   *  configurable: false,
   *  value: function (recipient) {
   *    return 'Hello, ' + recipient + '!'
   *  }
   * })
   * ```
   * The example above produces a public function available from NGN:
   *
   * ```
   * console.log(NGN.greet('world')) // outputs Hello, world!
   * @param  {string} attribute
   * Name of the attribute to add to the object.
   * @param  {Object} specification
   * The object specification, i.e.
   * ```
   * {
   *  enumerable: true/false,
   *  writable: true/false,
   *  configurable: true/false,
   *  value: {any}
   * }
   *
   * // OR
   *
   * {
   *  enumerable: true/false,
   *  get: function () { return ... },
   *  set: function (value) { some = value ... }
   * }
   * ```
   * @private
   */
  extend: NGN.privateconst(function (attribute, specification) {
    Object.defineProperty(this, attribute, specification)
  }),

  /**
   * @method inherit
   * Inherit the properties of another object/class.
   * @param  {object|function} source
   * The source object (i.e. what gets copied)
   * @param  {object|function} destination
   * The object properties get copied to.
   */
  inherit: NGN.const(function (source, dest) {
    if (!source || !dest) {
      return
    }
    source = typeof source === 'function' ? source.prototype : source
    dest = typeof dest === 'function' ? dest.prototype : dest
    Object.getOwnPropertyNames(source).forEach(function (attr) {
      const definition = Object.getOwnPropertyDescriptor(source, attr)
      Object.defineProperty(dest, attr, definition)
    })
  }),

  /**
   * @method slice
   * Converts an array-like object to an array.
   *
   * Example:
   * ```
   * function () {
   *  return NGN.slice(arguments)
   * }
   * @param  {Object} obj
   * The object to slice into an array.
   * @return {array}
   * @private
   */
  slice: NGN.private(function (obj) {
    return Array.prototype.slice.call(obj)
  }),

  /**
   * @method splice
   * Converts an array-like object to a spliced array.
   *
   * Example:
   * ```
   * function () {
   *  return NGN.splice(arguments)
   * }
   * @param  {Object} obj
   * The object to splice into an array.
   * @return {array}
   * @private
   */
  splice: NGN.private(function (obj) {
    return Array.prototype.splice.call(obj)
  }),

  /**
   * @method coalesce
   * Finds the first non-null/defined value in a list of arguments.
   * This can be used with {@link Boolean Boolean} values, since `true`/`false` is a
   * non-null/defined value.
   * @param {Mixed} args
   * Any number of arguments can be passed to this method.
   */
  coalesce: NGN.public(function () {
    for (let arg in arguments) {
      if (arguments[arg] !== undefined && arguments[arg] !== null) {
        return arguments[arg]
      }
    }
    return null
  }),

  /**
   * @property {boolean} nodelike
   * Indicates NGN is running in a node-like environment supporting
   * the `require` statement. This will detect node, io.js, Electron,
   * NW.js, and other environments presumably supporting Node.js.
   * @private
   */
  nodelike: NGN.get(function () {
    let node = false
    try {
      node = require !== undefined
    } catch (e) {}
    return node
  }),

  /**
   * @method dedupe
   * Deduplicate a simple array.
   * @param {array} array
   * The array to deduplicate.
   * @return {array}
   * The array with unique records.
   * @private
   */
  dedupe: NGN.private(function (array) {
    return array.filter(function (element, index) {
      return array.indexOf(element) === index
    })
  }),

  /**
   * @method typeof
   * A more specific typeof method.
   * @param  {any} element
   * The element to determine the type of.
   * @return {string}
   * Returns the type (all lower case).
   */
  typeof: NGN.define(false, false, false, function (el) {
    let value = Object.prototype.toString.call(el).split(' ')[1].replace(/\]|\[/gi, '').toLowerCase()
    if (value === 'function') {
      value = el.name || 'function'
    }
    return value.toLowerCase()
  }),

  /**
   * @method stack
   * Retrieve the stack trace from a specific code location without throwing
   * an exception.
   * @private
   * @returns {array}
   * Returns an array of objects. Each object contains the file, line, column,
   * and path within the stack. For example:
   *
   * ```
   * {
   * 	 path: 'path/to/file.js:127:14'
   *   file: 'path/to/file.js',
   *   line: 127,
   *   column: 14
   * }
   * ```
   */
  stack: NGN.get(function () {
    const me = this

    let stack = (new Error).stack.split('\n') || []

    stack = stack.filter(function (item) {
      return item.split(':').length > 1
    }).map(function (item) {
      item = item
        .replace(/^.*\s\(/i, '')
        .replace(/\)/gi, '')
        .replace(/^.*\@/i, '')
        .replace((me.nodelike ? process.cwd() : window.location.origin), '')
        .replace(/^.*\:\/\//, '')
        .replace(/\s{1,100}at\s{1,100}/gi, '')
        .replace(/anonymous\>/, 'console')
        .trim().split(':')

      return {
        path: item[0].substr(1, item[0].length - 1) + ':' + item[1] + ':' + item[2],
        file: item[0].substr(1, item[0].length - 1),
        line: parseInt(item[1], 10),
        column: parseInt(item[2], 10)
      }
    })

    return stack
  }),

  /**
   * @property css
   * A CSS string used for highlighting console output in Chrome and Firefox.
   *
   * **Example:**
   *
   * ```js
   * console.log('%cHighlight %c some text and leave the rest normal.', NGN.css, '')
   * ```
   * @private
   */
  css: NGN.privateconst('font-family: bold;')
})
