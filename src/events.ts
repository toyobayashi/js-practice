interface Listener {
  (...args: any[]): void
  _once?: true
}

class EventEmitter {
  _events: { [x: string]: Listener[] }
  static defaultMaxListeners = 10
  constructor () {
    this._events = {}
  }

  on (eventName: string, listener: Listener) {
    if (typeof listener !== 'function' || typeof eventName !== 'string') throw new Error('请检查参数类型: on(eventName: string, listener: Listener): EventEmitter')
    if (!this._events[eventName]) {
      this._events[eventName] = [listener]
    } else {
      if (this._events[eventName].length < this.getMaxListeners()) this._events[eventName].push(listener)
    }
    this.emit('newListener', eventName, listener)
    return this
  }

  once (eventName: string, listener: Listener) {
    if (typeof listener !== 'function' || typeof eventName !== 'string') throw new Error('请检查参数类型: once(eventName: string, listener: Listener): EventEmitter')
    listener._once = true
    return this.on(eventName, listener)
  }

  emit (eventName: string, ...args: any[]) {
    if (typeof eventName !== 'string') throw new Error('请检查参数类型: emit(eventName: string, ...args?: any[]): boolean')
    if (!this._events[eventName]) return false

    for (let i = 0; i < this._events[eventName].length; i++) {
      this._events[eventName][i].call(this, ...args)
      if (this._events[eventName][i]._once) {
        this._events[eventName].splice(i, 1)
        i--
      }
    }
    if (!this._events[eventName].length) delete this._events[eventName]
    return true
  }

  removeListener (eventName: string, listener: Listener) {
    if (typeof listener !== 'function' || typeof eventName !== 'string') throw new Error('请检查参数类型: removeListener(eventName: string, listener: Listener): EventEmitter')
    if (this._events[eventName]) {
      for (let i = 0; i < this._events[eventName].length; i++) {
        if (this._events[eventName][i] === listener) {
          this._events[eventName].splice(i, 1)
          i--
          this.emit('removeListener', eventName, listener)
        }
      }
      if (!this._events[eventName].length) delete this._events[eventName]
    }
    return this
  }

  removeAllListeners (eventName: string) {
    if (eventName && typeof eventName !== 'string') throw new Error('请检查参数类型: removeAllListeners(eventName?: string): EventEmitter')
    if (eventName) {
      if (this._events[eventName]) {
        for (let i = 0; i < this._events[eventName].length; i++) {
          this.emit('removeListener', eventName, this._events[eventName][i])
        }
        delete this._events[eventName]
      }
    } else {
      const eventNames = this.eventNames()
      for (let j = 0; j < eventNames.length; j++) {
        for (let i = 0; i < this._events[eventNames[j]].length; i++) {
          this.emit('removeListener', eventNames[j], this._events[eventNames[j]][i])
        }
      }
      this._events = {}
    }
    return this
  }

  addListener (eventName: string, listener: Listener) {
    if (typeof listener !== 'function' || typeof eventName !== 'string') throw new Error('请检查参数类型: addListener(eventName: string, listener: Listener): EventEmitter')
    return this.on(eventName, listener)
  }

  prependListener (eventName: string, listener: Listener) {
    if (typeof listener !== 'function' || typeof eventName !== 'string') throw new Error('请检查参数类型: prependListener(eventName: string, listener: Listener): EventEmitter')
    if (!this._events[eventName]) {
      this._events[eventName] = [listener]
    } else {
      if (this._events[eventName].length < this.getMaxListeners()) this._events[eventName].unshift(listener)
    }
    this.emit('newListener', eventName, listener)
    return this
  }

  prependOnceListener (eventName: string, listener: Listener) {
    if (typeof listener !== 'function' || typeof eventName !== 'string') throw new Error('请检查参数类型: prependOnceListener(eventName: string, listener: Listener): EventEmitter')
    listener._once = true
    return this.prependListener(eventName, listener)
  }

  eventNames () {
    return Object.keys(this._events)
  }

  listeners (eventName: string) {
    if (eventName && typeof eventName !== 'string') throw new Error('请检查参数类型: listeners(eventName: string): Listener[]')
    return this._events[eventName] ? this._events[eventName].slice(0) : []
  }

  listenerCount (eventName: string) {
    if (eventName && typeof eventName !== 'string') throw new Error('请检查参数类型: listenerCount(eventName: string): number')
    return this._events[eventName] ? this._events[eventName].length : 0
  }

  getMaxListeners () {
    return EventEmitter.defaultMaxListeners
  }

  setMaxListeners (n: number) {
    if (typeof n !== 'number') throw new Error('请检查参数类型: setMaxListeners(n: number): EventEmitter')
    EventEmitter.defaultMaxListeners = n
    return this
  }
}

export default EventEmitter
  