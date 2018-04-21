class NewPromise {
  constructor (callback) {
    this['[[PromiseStatus]]'] = 'pending'
    this['[[PromiseValue]]'] = void 0

    callback(value => {
      setTimeout(() => {
        this['[[PromiseValue]]'] = value
        this['[[PromiseStatus]]'] = 'fulfilled'
        if (this.__status__) this.__status__ = 'fulfilled'
      }, 0)
    }, err => {
      setTimeout(() => {
        this['[[PromiseValue]]'] = err
        this['[[PromiseStatus]]'] = 'rejected'
        if (this.__status__) this.__status__ = 'rejected'
      }, 0)
    })
  }

  then (thencb, catchcb) {
    let p = new NewPromise((resolve, reject) => {
      Object.defineProperties(this, {
        __status__: {
          get () { return this['[[PromiseStatus]]'] },
          set (s) {
            this['[[PromiseStatus]]'] = s
            if (s === 'fulfilled') {
              try {
                this['[[PromiseValue]]'] = thencb(this['[[PromiseValue]]'])
                if (this['[[PromiseValue]]'] && (this['[[PromiseValue]]'].constructor === NewPromise)) {
                  this['[[PromiseValue]]'].then(res => {
                    resolve(res)
                  }).catch(err => {
                    reject(err)
                  })
                } else {
                  resolve(this['[[PromiseValue]]'])
                }
              } catch (err) {
                reject(err)
              }
            } else {
              reject(this['[[PromiseValue]]'])
            }
          }
        }
      })
    })

    if (catchcb) {
      return p.catch(catchcb)
    } else {
      return p
    }
  }

  catch (catchcb) {
    let p = new NewPromise((resolve, reject) => {
      Object.defineProperties(this, {
        __status__: {
          get () { return this['[[PromiseStatus]]'] },
          set (s) {
            this['[[PromiseStatus]]'] = s
            if (s === 'rejected') {
              try {
                this['[[PromiseValue]]'] = catchcb(this['[[PromiseValue]]'])
                p.__status__ = 'resolvedr'
                p['[[PromiseValue]]'] = this['[[PromiseValue]]']
              } catch (err) {
                reject(this['[[PromiseValue]]'])
              }
            } else {
              resolve(this['[[PromiseValue]]'])
            }
          }
        }
      })
    })
    return p
  }

  finally (finallycb) {
    let p = new NewPromise((resolve, reject) => {
      Object.defineProperties(this, {
        __status__: {
          get () { return this['[[PromiseStatus]]'] },
          set (s) {
            this['[[PromiseStatus]]'] = s
            finallycb()
            if (s === 'resolvedr' || s === 'rejected') {
              reject(this['[[PromiseValue]]'])
            } else {
              resolve(this['[[PromiseValue]]'])
            }
          }
        }
      })
    })
    
    return p
  }
}
NewPromise.resolve = value => new NewPromise(resolve => resolve(value))
NewPromise.reject = err => new NewPromise((resolve, reject) => reject(err))

NewPromise.all = promiseArr => new NewPromise((resolve, reject) => {
  let t = setInterval(() => {
    let status = 'fulfilled'
    for (const p of promiseArr) {
      if (p['[[PromiseStatus]]'] === 'rejected') {
        clearInterval(t)
        status = 'rejected'
        reject(p['[[PromiseValue]]'])
        break
      }
    }
    if (status !== 'rejected') {
      for (const p of promiseArr) {
        if (p['[[PromiseStatus]]'] === 'pending') {
          status = 'pending'
          break
        }
      }
      if (status === 'fulfilled') {
        clearInterval(t)
        resolve(promiseArr.map(promise => promise['[[PromiseValue]]']))
      }
    }
  }, 0)
})

NewPromise.race = promiseArr => new NewPromise((resolve, reject) => {
  let t = setInterval(() => {
    let status = 'rejected'
    for (const p of promiseArr) {
      if (p['[[PromiseStatus]]'] === 'fulfilled') {
        clearInterval(t)
        status = 'fulfilled'
        resolve(p['[[PromiseValue]]'])
        break
      }
    }
    if (status !== 'fulfilled') {
      for (const p of promiseArr) {
        if (p['[[PromiseStatus]]'] === 'pending') {
          status = 'pending'
          break
        }
      }
      if (status === 'rejected') {
        clearInterval(t)
        reject(promiseArr.map(promise => promise['[[PromiseValue]]']))
      }
    }
  }, 0)
})

module.exports = NewPromise
