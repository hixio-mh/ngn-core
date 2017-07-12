const test = require('tape')

require('../../core/core')
require('../../core/exception')

test('Namespace', (t) => {
  t.ok(NGN !== undefined, 'NGN namespace is recognized.')
  t.ok(MissingNgnDependencyError !== undefined, 'NGN missing dependency error is recognized.')
  t.end()
})

test('Method Existance', (t) => {
  const methodList = [
    'global',
    'define',
    'public',
    'private',
    'const',
    'privateconst',
    'get',
    'set',
    'getset',
    'extend',
    'inherit',
    'slice',
    'splice',
    'nullIf',
    'nullif',
    'converge',
    'coalesce',
    'coalesceb',
    'nodelike',
    'dedupe',
    'typeof',
    'forceArray',
    'processStackItem',
    'stack',
    'isFn',
    'wrap',
    'wrapClass',
    'deprecate',
    'deprecateClass',
    'getObjectMissingPropertyNames',
    'getObjectExtraneousPropertyNames',
    'objectHasAll',
    'objectHasAny',
    'objectHasExactly',
    'objectRequires',
    'needs',
    'createAlias',
    'createException'
  ]

  for (let method of methodList) {
    t.ok(NGN.hasOwnProperty(method), `NGN.${method} exists.`)
  }

  let keys = Object.getOwnPropertyNames(NGN)

  for (let key of keys) {
    if (methodList.indexOf(key) < 0) {
      t.fail(`NGN.${key} has no sanity check.`)
    }
  }

  t.end()
})
