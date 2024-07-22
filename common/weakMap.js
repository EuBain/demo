

const wm = new WeakMap()

class User {
  constructor(id) {
    this.idProperty = Symbol('id')
    this.setId(id)
  }

  setPrivate(property, value) {
    const privateMembers = wm.get(this) || {}
    privateMembers[property] = value
    wm.set(this, privateMembers)
  }

  getPrivate(property) {
    return wm.get(this)[property];
  }

  setId(id) {
     this.setPrivate(this.idProperty, id)
  }

  getId(id) {
    this.getPrivate(this.idProperty, id)
  }
}


const user = new User(1)

console.log(user)
console.log(wm)

