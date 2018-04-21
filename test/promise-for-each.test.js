const { describe, it } = require('mocha')
const assert = require('assert')
const { promiseForEach } = require('..')

describe('@promiseForEach', () => {
  it('# promiseForEach(number)', async function () {
    let res = await promiseForEach(3, (value, index) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // console.log('    ' + value)
          assert.ok(index === value)
          resolve(index)
        }, 50);
      })
    })
    assert.ok(res === void 0)
  })

  it('# promiseForEach(object)', async function () {
    let test = { one: 'qqq', two: 456 }
    let res = await promiseForEach(test, (value, key) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // console.log('    ' + value)
          assert.strictEqual(test[key], value)
          resolve(value)
        }, 50);
      })
    })
    assert.ok(res === void 0)
  })

  it('# promiseForEach(array)', async function () {
    let test = [null, 666]
    let res = await promiseForEach(test, (value, index) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // console.log('    ' + value)
          assert.strictEqual(test[index], value)
          resolve(value)
        }, 50);
      })
    })
    assert.ok(res === void 0)
  })

  it('# promiseForEach(error)', async function () {
    let test = [7, 8, 9]
    try {
      await promiseForEach(test, (value, index) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // console.log('    ' + value)
            assert.strictEqual(test[index], value)
            reject(new Error('123'))
          }, 50);
        })
      })
    } catch(err) {
      assert.ok(err.constructor === Error)
    }
  })
})
