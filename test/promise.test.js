const { describe, it } = require('mocha')
const { NewPromise } = require('..')

describe('class NewPromise', () => {
  it('# NewPromise.prototype.then()', function (done) {
    this.timeout(Infinity)
    new NewPromise((resolve) => {
      setTimeout(() => {
        resolve('123')
      }, 100)
    }).then((res) => {
      return '456'
    }).then((res) => {
      if (res === '456') done()
    })
  })

  it('# NewPromise.prototype.then(() => NewPromise).then()', function (done) {
    this.timeout(Infinity)
    new NewPromise(resolve => {
      setTimeout(() => {
        resolve('123')
      }, 100)
    }).then((res) => {
      if (res !== '123') done(new Error('123'))
      return new NewPromise(resolve => {
        setTimeout(() => {
          resolve(res)
        }, 100)
      }).then(res => {
        if (res !== '123') done(new Error('123'))
        return 666
      })
    }).then(res => {
      if (res !== 666) done(new Error(666))
      else return new NewPromise((resolve, reject) => {
        setTimeout(() => {
          reject(res)
        }, 100)
      })
    }).catch(err => {
      done()
    })
    .then(res => {
      done(new Error('666'))
    }).then(res => {
      done(new Error('666'))
    })
  })

  it('# new NewPromise(x).then().then().catch()', function (done) {
    this.timeout(Infinity)
    new NewPromise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('test'))
      }, 100)
    }).then((res) => {
      done(new Error('456'))
      return '456'
    }).then((res) => {
      done(new Error('456'))
    }).catch(err => {
      done()
    })
  })

  it('# new NewPromise(x).then().catch().then()', function (done) {
    this.timeout(Infinity)
    new NewPromise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('test'))
      }, 100)
    }).then((res) => {
      done(new Error('456'))
    }).catch(err => {
      done()
    }).then((res) => {
      done(new Error('err'))
    })
  })

  it('# new NewPromise().then().catch().then(x).catch()', function (done) {
    this.timeout(Infinity)
    new NewPromise((resolve, reject) => {
      setTimeout(() => {
        resolve('yes')
      }, 100)
    }).then((res) => {
      return '456'
    }).catch(err => {
      done(new Error('err'))
    }).then((res) => {
      if (res !== '456') done(new Error('456'))
      throw new Error('test')
    }).catch(err => {
      done()
    }).catch(err => {
      console.log(err)
    })
  })

  it('# new NewPromise().then(x).then(then, catch).catch()', function (done) {
    this.timeout(Infinity)
    let p = new NewPromise((resolve, reject) => {
      setTimeout(() => {
        resolve('yes')
      }, 100)
    }).then((res) => {
      throw new Error('test')
      return '456'
    }).then((res) => {
      done(new Error(res))
    }, err => {
      done()
    })
  })

  it('# NewPromise.all()', function (done) {
    this.timeout(Infinity)
    NewPromise.all([
      new NewPromise((resolve, reject) => {
        setTimeout(() => {
          resolve(123)
        }, 100)
      }),
      new NewPromise((resolve, reject) => {
        setTimeout(() => {
          resolve(456)
        }, 200)
      })
    ]).then(res => {
      done()
    })
  })
  it('# NewPromise.all(x)', function (done) {
    this.timeout(Infinity)
    NewPromise.all([
      new NewPromise((resolve, reject) => {
        setTimeout(() => {
          reject(444)
        }, 100)
      }),
      new NewPromise((resolve, reject) => {
        setTimeout(() => {
          resolve(456)
        }, 200)
      })
    ]).then(res => {
      done(new Error('all()'))
    }).catch(err => {
      done()
    })
  })
  it('# NewPromise.race()', function (done) {
    this.timeout(Infinity)
    NewPromise.race([
      new NewPromise((resolve, reject) => {
        setTimeout(() => {
          resolve(123)
        }, 100)
      }),
      new NewPromise((resolve, reject) => {
        setTimeout(() => {
          resolve(456)
        }, 200)
      })
    ]).then(res => {
      if (res === 123) done()
      else done(new Error('race 123'))
    })
  })
  it('# NewPromise.race(x)', function (done) {
    this.timeout(Infinity)
    NewPromise.race([
      new NewPromise((resolve, reject) => {
        setTimeout(() => {
          reject(444)
        }, 100)
      }),
      new NewPromise((resolve, reject) => {
        setTimeout(() => {
          reject(456)
        }, 200)
      })
    ]).then(res => {
      done(new Error('race()'))
    }).catch(err => {
      if (err.length === 2) done()
    })
  })

  it('# new NewPromise().catch().then().finally()', function (done) {
    this.timeout(500)
    new NewPromise((resolve, reject) => {
      resolve(666)
    }).catch(err => {
      done(new Error('666'))
    }).then(res => {
      if (res !== 666) done(new Error('666'))
    }).finally(() => {
      done()
    })
  })
  it('# new NewPromise(x).catch().then().finally()', function (done) {
    this.timeout(500)
    new NewPromise((resolve, reject) => {
      reject(666)
    }).catch(err => {
      if (err !== 666) done(err)
    }).then(res => {
      done(new Error('666'))
    }).finally(() => {
      done()
    })
  })
  it('# new NewPromise().finally().catch().then()', function (done) {
    this.timeout(500)
    new NewPromise((resolve, reject) => {
      resolve(666)
    }).finally(() => {
      done()
    }).catch(err => {
      done(new Error('666'))
    }).then(res => {
      if (res !== 666) done(new Error('666'))
    })
  })
  it('# new NewPromise(x).finally().catch().then()', function (done) {
    this.timeout(500)
    new NewPromise((resolve, reject) => {
      reject(666)
    }).finally(() => {
      done()
    }).catch(err => {
      if (err !== 666) done(new Error('666'))
    }).then(res => {
      done(new Error('666'))
    })
  })
  it('# new NewPromise().catch().finally().then()', function (done) {
    this.timeout(500)
    new NewPromise((resolve, reject) => {
      resolve(666)
    }).catch(err => {
      done(new Error('666'))
    }).finally(() => {
      done()
    }).then(res => {
      if (res !== 666) done(new Error('666'))
    })
  })
  it('# new NewPromise(x).catch().finally().then()', function (done) {
    this.timeout(500)
    new NewPromise((resolve, reject) => {
      reject(666)
    }).catch(err => {
      if (err !== 666) done(new Error('666'))
    }).finally(() => {
      done()
    }).then(res => {
      done(new Error('666'))
    })
  })
  it('# new NewPromise().then().finally().catch()', function (done) {
    this.timeout(500)
    new NewPromise((resolve, reject) => {
      resolve(666)
    }).then(res => {
      if (res !== 666) done(new Error('666'))
    }).finally(() => {
      done()
    }).catch(err => {
      done(new Error('666'))
    })
  })
  it('# new NewPromise(x).then().finally().catch()', function (done) {
    this.timeout(500)
    new NewPromise((resolve, reject) => {
      reject(666)
    }).then(res => {
      done(new Error('666'))
    }).finally(() => {
      done()
    }).catch(err => {
      if (err !== 666) done(new Error('666'))
    })
  })
  it('# NewPromise.resolve()', function (done) {
    NewPromise.resolve(123).then(res => {
      if (res === 123) done()
    })
  })
  it('# NewPromise.reject()', function (done) {
    NewPromise.reject(123).then(res => {
      done(new Error('666'))
    }).catch(err => {
      if (err === 123) done()
    })
  })
})
