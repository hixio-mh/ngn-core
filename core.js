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
   * @method set
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
   * Any valid JavaScript function that accepts a single argument (value).
   * @private
   */
  set: NGN.define(false, false, false, function (fn) {
    return {
      enumerable: false,
      set: fn
    }
  }),

  /**
   * @method getset
   * Create a private property defintion containing both a `getter` and `setter`
   * for the specified attribute.
   * @param  {function} getFn
   * Any valid async JavaScript function with a `return` value.
   * @param  {function} setFn
   * Any valid JavaScript function that accepts a single argument (value).
   * @private
   */
  getset: NGN.define(false, false, false, (getter, setter) => {
    return {
      enumerable: false,
      get: getter,
      set: setter
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
   * @param  {Object} descriptor
   * The object descriptor, i.e.
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
  extend: NGN.privateconst(function (attribute, descriptor) {
    Object.defineProperty(this, attribute, descriptor)
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

    const prototype = Object.getOwnPropertyNames(Object.getPrototypeOf(source)).filter((attr) => {
      return attr.trim().toLowerCase() !== 'constructor' && !dest.hasOwnProperty(attr)
    })

    prototype.forEach((attr) => {
      const cfg = Object.getOwnPropertyDescriptor(source, attr)

      if (cfg === undefined && typeof source[attr] === 'function') {
        Object.defineProperty(dest, attr, NGN.const(function () {
          return source[attr].apply(this, arguments)
        }))
      }
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
    for (let arg = 0; arg < arguments.length; arg++) {
      try {
        if (arguments[arg] !== undefined && arguments[arg] !== null) {
          return arguments[arg]
        }
      } catch (e) {}
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
    try {
      return process !== undefined
    } catch (e) {
      return false
    }
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
  dedupe: NGN.private((array) => {
    return array.filter((element, index) => {
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
  typeof: NGN.privateconst((el) => {
    let value = Object.prototype.toString.call(el).split(' ')[1].replace(/\]|\[/gi, '').toLowerCase()

    if (value === 'function') {
      if (!el.name) {
        return el.toString().replace(/\n/gi, '').replace(/^function\s|\(.*$/mgi,'').toLowerCase()
      } else {
        value = el.name || 'function'
      }
    }

    return value.toLowerCase();
   }),

  /**
   * @method stack
   * Retrieve the stack trace from a specific code location without throwing
   * an exception. Files are always listed from the root. This is the default
   * order in browsers, but the reverse of the normal stack order in node-like
   * environments.
   *
   * For example, the following stack on node shows `_test.js` as the last item
   * in the array. In node-like environments, the `_test.js` would normally be
   * the first item in the stacktrace.
   *
   * ```js
   * [
   *   { path: 'node.js:348:7', file: 'node.js', line: 348, column: 7 },
   *   { path: 'module.js:575:10',
   *     file: 'module.js',
   *     line: 575,
   *     column: 10 },
   *   { path: 'module.js:550:10',
   *     file: 'module.js',
   *     line: 550,
   *     column: 10 },
   *   { path: 'module.js:541:32',
   *     file: 'module.js',
   *     line: 541,
   *     column: 32 },
   *   { path: '/_test.js:8:14', file: '/_test.js', line: 8, column: 14 }
   * ]
   * ```
   *
   * By standardizing the order of the stack trace, it is easier to programmatically
   * identify sources of problems. This method does not prevent developers from
   * accessing a normal stacktrace.
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
   *
   * If a stacktrace is unavailable for any reason, the array will contain a
   * single element like:
   *
   * ```js
   * {
   *   path: 'unknown',
   *   file: 'unknown',
   *   line: 0,
   *   column: 0
   * }
   * ```
   */
  processStackItem: NGN.privateconst(function (item, uri) {
    return item.replace(/at.*\(|\)/gi, '')
      .replace(uri, './')
      .replace(/\/{2,100}/gi, '/')
      .trim().split(':')
  }),

  stack: NGN.get(function () {
    const originalStack = (new Error).stack.split('\n')
    let stack = (new Error).stack.split('\n') || []
    let fnRegex = /at.*\(/gi

    stack = stack.filter((item) => {
      return item.split(':').length > 1
    }).map((item) => {
      let operation = fnRegex.exec(item)

      if (operation) {
        operation = operation[0].replace(/^at\s{1,100}|\s{1,100}\($/gi, '').replace('<anonymous>', 'console')
      }

      if (this.nodelike) {
        item = this.processStackItem(item.toString(), process.cwd())

        return {
          path: item.join(':').replace('./', process.cwd() + '/'),
          // path: item[0].substr(0, item[0].length) + ':' + item[1] + ':' + item[2],
          file: item[0].substr(0, item[0].length),
          line: parseInt(item[1], 10),
          column: parseInt(item[2], 10),
          operation: operation
        }
      } else {
        item = this.processStackItem(item.toString(), window.location.origin)

        return {
          path: item[0].substr(1, item[0].length - 1) + ':' + item[1] + ':' + item[2],
          file: item[0].substr(1, item[0].length - 1),
          line: parseInt(item[1], 10),
          column: parseInt(item[2], 10),
          operation: operation
        }
      }
    })

    if (stack.length === 0) {
      return [{
        path: 'unknown',
        file: 'unknown',
        line: 0,
        column: 0
      }]
    } else if (this.nodelike) {
      stack.reverse()
    }

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
  css: NGN.get(() => {
    return NGN.nodelike ? '' : 'font-weight: bold;'
  }),

  /**
   * @method isFn
   * A shortcut method for determining if a variable is a function.
   * This is useful for identifying the existance of callback methods.
   * @param {any} variable
   * The variable to identify as a function.
   * @returns {boolean}
   * @private
   */
  isFn: NGN.privateconst((v) => {
    return typeof v === 'function'
  }),

  /**
   * @method wrap
   * Executes a **synchronous** method before invoking a standard function.
   * This is primarily designed for displaying warnings, but can also be
   * used for other operations like migration layers.
   * @param {function} preMethod
   * The **synchronous** function to invoke before the class is instantiated. This
   * method receives the same arguments passed to the class.
   * @param {function} method
   * The function to wrap.
   * @private
   */
  wrap: NGN.privateconst(function (preFn, fn) {
    return function () {
      preFn(...arguments)
      fn(...arguments)
    }
  }),

  /**
   * @method wrapClass
   * Executes a **synchronous** method before returning an instantiated class.
   * In other words, it runs a function first, then returns the equivalent of
   * `new MyClass(...)`. This is primarily designed for displaying warnings,
   * but can also be used for other operations like migration layers.
   * @param {function} preMethod
   * The **synchronous** method to invoke before the class is instantiated. This
   * method receives the same arguments passed to the class.
   * @param {function} class
   * The class to wrap.
   * @private
   */
  wrapClass: NGN.privateconst(function (preFn, classFn) {
    return function () {
      preFn(...arguments)
      return new classFn(...arguments)
    }
  }),

  /**
   * @method deprecate
   * Logs a warning indicating the method is deprecated.
   * @param {function} method
   * The method to return/execute.
   * @param {string} [message='The method has been deprecated.']
   * The warning displayed to the user.
   */
  deprecate: NGN.privateconst(function (fn, message='The method has been deprecated.') {
    return this.wrap(() => {
      if (NGN.nodelike) {
        console.warn('DEPRECATION NOTICE: ' + message)
      } else {
        console.warn('%cDEPRECATION NOTICE: %c' + message, NGN.css, 'font-weight: normal;')
      }
    }, fn)
  }),

  /**
   * @method deprecateClass
   * Logs a warning indicating the class is deprecated. This differs from
   * #deprecate by extending & preserving the original class (the resulting
   * class can be used with the `new` operator).
   * @param {function} class
   * The class to return/execute.
   * @param {string} [message='The class has been deprecated.']
   * The warning displayed to the user.
   */
  deprecateClass: NGN.privateconst(function (classFn, message='The class has been deprecated.') {
    return this.wrapClass(() => {
      if (NGN.nodelike) {
        console.warn('DEPRECATION NOTICE: ' + message)
      } else {
        console.warn('%cDEPRECATION NOTICE: %c' + message, NGN.css, 'font-weight: normal;')
      }
    }, classFn)
  }),

  /**
   * @method needs
   * A method to check for the existance of required attributes in an object.
   * This is designed to check for namespace existance.
   *
   * ```js
   * NGN.uses(NGN, 'DOM','BUS', 'NET', 'JUNK') // Throws an error because "JUNK" doesn't exist.
   * ```
   * @param {Object} namespace
   * The object to check.
   * @param {String[]} attributes
   * A list of attributes to check for.
   * @private
   */
  needs: NGN.private(function (namespace, ...attributes) {
    if (typeof namespace !== 'object') {
      throw new Error('NGN.uses() requires an object.')
    }

    let missing = []

    for (let value in attributes) {
      if (!namespace.hasOwnProperty(value)) {
        missing.push(value)
      }
    }

    // Throw an error if there are any missing attributes.
    if (missing.length > 0) {
      throw new MissingDependencyError(`Missing ${namespace.constructor.name} dependencies: ${missing.join(', ')}`.replace(/\s{2,100}/gi, ' '))
    }
  }),

  /**
   * @method createAlias
   * A helper method to alias a value on an object. This is the equivalent of:
   * ```js
   * Object.defineProperty(namespace, name, NGN.get(() => {
   *   return value
   * }))
   * ```
   * @param  {Object} namespace
   * The object to apply the alias property to.
   * @param  {String} name
   * The alias name.
   * @param  {Any} value
   * The value to return.
   * @private
   */
  createAlias: NGN.private(function (namespace, name, value) {
    Object.defineProperty(namespace, name, NGN.get(() => {
      return value
    }))
  })
})
