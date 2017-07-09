'use strict'

var test = require('tape')
var nodelike
try {
  if (window) {
    nodelike = false
  } else {
    nodelike = true
  }
} catch (e) {
  nodelike = true
}

if (nodelike) {
  global.NGN = {}
  require('../core/core')
}

test('Global', function (t) {
  if (!nodelike) {
    t.ok(window.NGN !== undefined, 'NGN namespace exists.')
  }

  t.ok(NGN.define !== undefined, 'NGN.define() exists.')

  var x = {}

  Object.defineProperties(x, {
    y: NGN.define(true, false, false, 1)
  })

  t.ok(x.y === 1, 'NGN.define() works.')

  t.ok(typeof NGN.get === 'function', 'NGN._get() alias exists.')

  var y = {}

  Object.defineProperties(y, {
    x: NGN.define(true, false, false, 1),
    z: NGN.get(function () {
      return this.x
    })
  })

  t.ok(y.x === y.z, 'NGN.get() works.')

  t.ok(typeof NGN.slice === 'function', 'NGN.slice alias exists for Array.prototype.slice.call')
  t.ok(NGN.slice(arguments).length === 1, 'NGN.slice alias works.')

  t.ok(typeof NGN.splice === 'function', 'NGN._splice alias exists for Array.prototype.splice.call')
  t.ok(NGN.splice(arguments, 1).length === 0, 'NGN.splice alias works.')

  t.ok(NGN.BUS !== undefined, 'NGN.BUS exists.')
  t.ok(NGN.NET !== undefined, 'NGN.NET exists.')

  if (!nodelike) {
    var p1 = document.createElement('p')
    var c1 = document.createElement('b')
    var c2 = document.createElement('i')

    p1.appendChild(c1)
    p1.appendChild(c2)

    document.body.appendChild(p1)

    t.ok(typeof NGN.typeof === 'function', 'NGN.typeof exists.')
    t.ok(NGN.typeof(document.querySelector('p')) === 'htmlparagraphelement', 'NGN.typeof works for HTML elements.')

    t.ok(NGN.DOM !== undefined, 'NGN.DOM exists.')
    t.ok(NGN.DOM.svg !== undefined, 'NGN.DOM.svg exists.')
  }

  // Add delay because some browsers on Sauce Labs haven't fully loaded all scripts at this point.
  setTimeout(t.end, 1000)
})
