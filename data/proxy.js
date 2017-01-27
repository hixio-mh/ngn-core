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

      initialized: NGN.private(false),
      liveSyncEnabled: NGN.private(false)
    })
  }

  init (store) {
    if (this.initialized) {
      return
    } else {
      this.initialized = true
    }

    this.store = store

    if (store instanceof NGN.DATA.Store) {
      Object.defineProperties(store, {
        changelog: NGN.get(() => {
          return this.changelog
        })
      })
    }
  }

  /**
   * @property {string} proxytype
   * The type of underlying data (model or store).
   * @private
   */
  get type () {
    return this.store instanceof NGN.DATA.Store ? 'store' : 'model'
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

  /**
   * @method enableLiveSync
   * Live synchronization monitors the dataset for changes and immediately
   * commits them to the data storage system.
   * @fires live.create
   * Triggered when a new record is persisted to the data store.
   * @fires live.update
   * Triggered when a record modification is persisted to the data store.
   * @fires live.delete
   * Triggered when a record is removed from the data store.
   */
  enableLiveSync () {
    if (this.liveSyncEnabled) {
      return
    }

    this.liveSyncEnabled = true

    if (this.type === 'model') {
      // Basic CRUD (-R)
      this.store.on('field.create', this.saveAndEmit('live.create'))
      this.store.on('field.update', this.saveAndEmit('live.update'))
      this.store.on('field.remove', this.saveAndEmit('live.delete'))

      // relationship.create is unncessary because no data is available
      // when a relationship is created. All related data will trigger a
      // `field.update` event.
      this.store.on('relationship.remove', this.saveAndEmit('live.delete'))
    } else {
      // Persist new records
      this.store.on('record.create', this.saveAndEmit('live.create'))
      this.store.on('record.restored', this.saveAndEmit('live.create'))

      // Update existing records
      this.store.on('record.update', this.saveAndEmit('live.update'))

      // Remove old records
      this.store.on('record.delete', this.saveAndEmit('live.delete'))
      this.store.on('clear', this.saveAndEmit('live.delete'))
    }
  }

  saveAndEmit (eventName) {
    return (record) => {
      this.save(() => {
        this.emit(eventName, record || null)
        this.store.emit(eventName, record || null)
      })
    }
  }
}

// NGN.DATA.Proxy = NgnDataProxy
Object.defineProperty(NGN.DATA, 'Proxy', NGN.const(NgnDataProxy))
