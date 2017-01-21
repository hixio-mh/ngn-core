'use strict'

/**
 * @class NGN.DATA.Proxy
 * Provides a gateway to remote services such as HTTP and
 * websocket endpoints. This can be used directly to create
 * custom proxies.
 */
class NgnDataProxy extends NGN.EventEmitter {
  constructor (config) {
    config = config || {}

    super(config)

    Object.defineProperties(this, {
      /**
       * @configproperty {NGN.DATA.Store} store (required)
       * THe store for data being proxied.
       */
      store: NGN.private(null),

      /**
       * @configproperty {string} [url=http://localhost
       * The root URL for making network requests (HTTP/WS/TLS).
       */
      url: NGN.public(config.url || 'http://localhost'),

      /**
       * @config {string} username
       * If using basic authentication, provide this as the username.
       */
      username: NGN.public(config.username || null),

      /**
       * @config {string} password
       * If using basic authentication, provide this as the password.
       */
      password: NGN.public(config.password || null),

      /**
       * @config {string} token
       * If using an access token, provide this as the value. This
       * will override basic authentication (#username and #password
       * are ignored). This sets an `Authorization: Bearer <token>`
       * HTTP header.
       */
      token: NGN.public(config.token || null),

      /**
       * @property {string} proxytype
       * The type of underlying data (model or store).
       * @private
       */
      type: NGN.private(null)
    })
  }

  init (store) {
    NGN.inherit(this, store)

    if (store instanceof NGN.DATA.Store) {
      Object.defineProperties(store, {
        changelog: NGN.get(() => {
          return this.changelog
        })
      })
    }

    this.store = store
    this.type = store instanceof NGN.DATA.Store ? 'store' : 'model'
  }

  /**
   * @property changelog
   * A list of the record changes that have occurred.
   * @returns {object}
   * An object is returned with 3 keys representative of the
   * action taken:
   *
   * ```js
   * {
   *   create: [NGN.DATA.Model, NGN.DATA.Model],
   *   update: [NGN.DATA.Model],
   *   delete: []
   * }
   * ```
   *
   * The object above indicates two records have been created
   * while one record was modified and no records were deleted.
   * **NOTICE:** If you add or load a JSON object to the store
   * (as opposed to adding an instance of NGN.DATA.Model), the
   * raw object will be returned. It is also impossible for the
   * data store/proxy to determine if these have changed since
   * the NGN.DATA.Model is responsible for tracking changes to
   * data objects.
   * @private
   */
  get changelog () {
    const me = this

    if (this.store === null && !(this instanceof NGN.DATA.Store)) {
      return []
    }

    return {
      create: this.store._created,
      update: this.store.records.filter(function (record) {
        if (me.store._created.indexOf(record) < 0 && me.store._deleted.indexOf(record) < 0) {
          return false
        }
        return record.modified
      }).map(function (record) {
        return record
      }),
      delete: this.store._deleted
    }
  }

  save () {
    console.warn('Save should be overridden by a proxy implementation class.')
  }

  fetch () {
    console.warn('Fetch should be overridden by a proxy implementation class.')
  }
}

NGN.DATA.Proxy = NgnDataProxy
// Object.defineProperty(NGN.DATA, 'Proxy', NGN.const(NgnDataProxy))
