'use strict'

/**
 * @class NGN.EventEmitter
 * @inheritdoc
 */
NGN.inherit(Object.defineProperties({}, {
  queued: NGN.private({}),

  /**
   * @method pool
   * A helper command to create multiple related subscribers
   * all at once. This is a convenience function.
   * @property {string} [prefix]
   * Supply a prefix to be added to every event. For example,
   * `myScope.` would turn `someEvent` into `myScope.someEvent`.
   * @property {Object} subscriberObject
   * A key:value object where the key is the name of the
   * unprefixed event and the key is the handler function.
   * @property {Function} [callback]
   * A callback to run after the entire pool is registered. Receives
   * a single {Object} argument containing all of the subscribers for
   * each event registered within the pool.
   */
  pool: NGN.const(function (prefix, group, callback) {
    if (typeof prefix !== 'string') {
      group = prefix
      prefix = ''
    }

    let pool = {}

    for (let eventName in group) {
      let topic = (prefix.trim() || '') + eventName
      if (typeof group[eventName] === 'function') {
        pool[eventName] = this.on(topic, group[eventName])
      } else {
        console.warn(topic + ' could not be pooled in the event emitter because it\'s value is not a function.')
      }
    }
    if (callback) {
      callback(pool)
    }
  }),

  /**
   * @method attach
   * Attach a function to a topic. This can be used
   * to forward events in response to asynchronous functions.
   *
   * For example:
   *
   * ```js
   * myAsyncDataFetch(NGN.BUS.attach('topicName'))
   * ```
   *
   * This is the same as:
   *
   * ```js
   * myAsyncCall(function(data){
   *  NGN.BUS.emit('topicName', data)
   * })
   * ```
   * @param {string} eventName
   * The name of the event to attach a handler method to.
   * @param {boolean} [preventDefaultAction=false]
   * Setting this to `true` will execute a `event.preventDefault()` before
   * attaching the handler.
   * @returns {function}
   * Returns a function that will automatically be associated with an event.
   */
  attach: NGN.const(function (eventName, preventDefaultAction) {
    const me = this
    preventDefaultAction = NGN.coalesce(preventDefaultAction, false)

    return function (e) {
      if (preventDefaultAction && e.hasOwnProperty('preventDefault')) {
        e.preventDefault()
      }
      let args = Array.from(arguments)
      args.unshift(eventName)
      me.emit.apply(me, args)
    }
  }),

  /**
   * @method bind
   * A special subscriber that fires one or more event in response to
   * to an event. This is used to bubble events up/down an event chain.
   *
   * For example:
   *
   * ```js
   * BUS.bind('sourceEvent', ['someEvent','anotherEvent'], {payload:true})
   * ```
   * When `sourceEvent` is published, the bind method triggers `someEvent` and
   * `anotherEvent`, passing the payload object to `someEvent` and
   * `anotherEvent` subscribers simultaneously.
   *
   * @param {String} sourceEvent
   * The event to subscribe to.
   * @param {String|Array} triggeredEvent
   * An event or array of events to fire in response to the sourceEvent.
   * @param {any} data
   * Optional data to pass to each bound event handler.
   * @returns {Object}
   * Returns an object with a single `remove()` method.
   */
  bind: NGN.const(function (eventName, triggers, payload) {
    triggers = typeof triggers === 'string' ? [triggers] : triggers

    const me = this
    let listener = function () {
      let args = Array.from(arguments)

      if (payload) {
        args.push(payload)
      }

      for (let trigger in triggers) {
        let argList = args.slice()
        argList.unshift(triggers[trigger])
        me.emit.apply(me, argList)
      }
    }

    this.on(eventName, listener)

    // Provide handle back for removal of topic
    return {
      remove: function () {
        me.off(eventName, listener)
      }
    }
  }),

  /**
   * @method queue
   * This method waits for the specified duration, then publishes an
   * event once. This will publish the event only once at the end of the
   * wait period, even if the event is triggered multiple times. This can
   * be useful when working with many events triggered in rapid succession.
   *
   * For example, an NGN.DATA.Model representing a person may be used to
   * track a user profile. The NGN.DATA.Model fires an event called `field.update`
   * every time a data field is modified. In many cases, a user may update
   * multiple fields of their profile using a form with a "Save" button.
   * Instead of generating a new "save" (to disk, to memory, to an API, etc)
   * operation for each field, the publishOnce event can wait until all
   * changes are made before running the save operation.
   *
   * ```js
   * // Create a data model representing a person.
   * var Person = new NGN.DATA.Model({....})
   *
   * // Create a new person record for a user.
   * var user = new Person()
   *
   * // When the user is modified, save the data.
   * user.on('field.update', function () {
   * 	 // Wait 300 milliseconds to trigger the save event
   *   NGN.BUS.queue('user.save', 300)
   * })
   *
   * // Save the user using an API
   * NGN.BUS.on('user.save', function () {
   * 	 NGN.HTTP.put({
   * 	   url: 'https://my.api.com/user',
   * 	   json: user.data
   * 	 })
   * })
   *
   * // Modify the record attributes (which are blank by default)
   * user.firstname = 'John'
   * user.lastname = 'Doe'
   * user.age = 42
   *
   * // Make another update 1 second later
   * setTimeout(function () {
   *   user.age = 32
   * }, 1000)
   * ```
   *
   * The code above sets up a model and record. Then it listens to the record
   * for field updates. Each time it recognizes an update, it queues the "save"
   * event. When the queue matures, it fires the `user.save` event.
   *
   * The first `field.update` is triggered when `user.firstname = 'John'` runs.
   * This initiates a queue for `user.save`, set to mature in 300 millisenconds.
   * Next, a `field.update` is triggered when `user.lastname = 'Doe'` runs.
   * This time, since the queue for `user.save` is already initiated, notthing
   * new happens. Finally, a `field.update` is triggered when `user.age = 42`
   * runs. Just like the last one, nothing happens since the `user.save` queue
   * is already active.
   *
   * The `user.save` queue "matures" after 300 milliseconds. This means after
   * 300 milliseconds have elapsed, the `user.save` event is triggered. In this
   * example, it means the `NGN.HTTP.put()` code will be executed. As a result,
   * all 3 change (firstname, lastname, and age) will be complete before the
   * API request is executed. The queue is cleared immediately.
   *
   * The final update occurs 1 second later (700 milliseconds after the queue
   * matures). This triggers a `field.update`, but since the queue is no
   * longer active, it is re-initiated. 300 milliseconds later, the `user.save`
   * event is fired again, thus executing the API request again (1.3 seconds
   * in total).
   * @param {string} eventName
   * The event/topic to publish/emit.
   * @param {Number} [delay=300]
   * The number of milliseconds to wait before firing the event.
   * @param {Any} [payload]
   * An optional payload, such as data to be passed to an event handler.
   */
  queue: NGN.const(function (eventName, delay) {
    if (!this.queued.hasOwnProperty(eventName)) {
      const me = this
      let args = Array.from(arguments)
      args.splice(1, 1)

      this.queued[eventName] = setTimeout(function () {
        delete me.queued[eventName]
        me.emit.apply(me, args)
      }, delay)
    }
  })
}), NGN.EventEmitter)
