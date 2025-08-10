

class Simple {
  constructor () {
    store = new Map()
    this.set = store.set.bind(store)
  }
  set (key, value?) {
    this.store.set(key, value)
  }
  get (key) {
    return this.store.get(key)
  }
  static createInit () {
    if (!Simple.instance) {
      Simple.instance = new Simple()
    }
    return Simple.instance
  }
}

const {createInit} = Simple

const simple = createInit()


const test = createInit()

debugger