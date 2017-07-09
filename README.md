# NGN.js

NGN is a software architecture library. We think of it like a drop-in engine
for creating browser-based apps, API's & other backend platforms, your own
frameworks, or augmenting other frameworks.

## Availability

NGN is available as a frontend library at [https://cdn.author.io](https://cdn.author.io).
It is also available as a series of [npm modules](https://www.npmjs.com/org/ngnjs)
for Node.js developers.

The core library is simple, powerful, and unopinionated. The authors certainly
have opinions about software architecture, which is why [NGNX](https://github.com/ngnjs/NGNX) has been released as an optional extension.
NGNX exists to resolve different challenges and best practices.

NGN also has an Infrastructure Development Kit (IDK). This is a collection of
pre-built/deployable building blocks, delivered as Docker containers, available on our [Docker account](https://hub.docker.com/r/ngnjs/). For example, there are Development
and production-ready web servers, message queues, and API/RPC infrastructure. We've assembled NGN & NGNX libraries in different ways to simplify systems architecture. When applicable, containers also contain non-JavaScript components.

## Core Concepts

**tldr;**

NGN provides building blocks for:

- Event Driven Architecture
- Networking (HTTP Requests)
- Class/Entity Modeling
- Data Modeling & Management
- Processing Flows
- Exception Management
- Logging

### Overview

The (global) NGN namespace contains a number of core methods to support
all disciplines/concepts of the library. See the API docs for details.

The library primarily follows [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming) principles. It's
well tested (2400+ tests), used in production systems, and has grown quite
sophisticated since we first started writing it in 2013.

_Event Driven Architecture_

NGN excels at creating [event-driven architecture](https://en.wikipedia.org/wiki/Event-driven_architecture) for the front and backend. The `NGN.EventEmitter` class can be used in browsers or from Node.js. It is based on the [Node.js EventEmitter](https://nodejs.org/dist/latest-v8.x/docs/api/events.html#events_class_eventemitter), but with _significantly enhanced functionality_. It's inspired by
and compliant with Node's event emitter API. If you've used Node's event emitter, you already know 80% of the `NGN.EventEmitter` class.

NGN has a global event bus, called `NGN.BUS`.

_Networking (HTTP Requests)_

`NGN.NET` contains methods for communicating over a network via XHR. All of
the major HTTP request operations are supported, such as `GET`, `POST`, `PUT`,
`DELETE`, `HEAD`, `OPTIONS`, and a few special handlers (such as `NGN.NET.json()`).

There are fine-grained controls with common defaults. This part of the library
allows systems/app developers to focus on _what_ they're sending to remote
servers instead of _how_.

_Class/Entity Modeling_

ES2015 modules and classes have gained prominence in modern JavaScript code, but
they still lack features such as private attributes/methods. It's also up to
developers to manage the progression of these classes, which typically means
preparing experimental methods and deprecating old ones. NGN contains several
helper methods to simplify this process. For example:

```js
class Person extends NGN.EventEmitter {
  constructor (cfg) {
    super()

    Object.defineProperties(this, {
      firstName: NGN.public(cfg.firstname),
      lastName: NGN.public(cfg.lastname),
      age: NGN.private(cfg.age),
      gender: NGN.const(cfg.gender)
    })
  }

  oldMethod () {
    // Use shiny new method instead.
    return NGN.deprecate(this.shinyNewMethod)
  }

  shinyNewMethod () {
    ...
  }
}
```

_Data Modeling & Management_

The NGN.DATA library provides data models, stores, proxies, and more. It is
enormously powerful.

TODO: Write about data fields, virtuals, relationships/nested data, auto ID,
rollback (undo) support, TTL, indexing, filtering, sorting, events/triggers,
soft deletes/purging/restoration, LIFO/FIFO, validation, checksums, data maps,
representations, serialization, encryption, bulk loading, reordering, querying,
snapshots, connection pooling, realtime persistence, file stores, remote stores,
and GUID support.

_Processing Flows_

NGN.Tasks provides simple and human-readable flow control.

TODO: Copy the ShortBus readme.

_Exception Management_

Exception handling in JavaScript is often overlooked. NGN makes Exception management
a first class citizen. It is possible to define custom JavaScript errors for
systems/applications. NGN takes exceptions a step further by adding the ability
to manage state (dev vs production). NGN also support `cause` and `help` features
to simplify troubleshooting/debugging domain-specific errors (business/app logic).

By defining custom exceptions at a global level, it is far easier to evolve
troubleshooting practices.

_Logging_

NGN provides optional custom logging extensions based on standard `console`
methods. It provides log interceptors, supports severity levels, and integrates
with the NGN.EventEmitter, making it easy to stream logs in realtime or cut them
off entirely.
