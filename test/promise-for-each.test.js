const { describe, it } = require('mocha')
const assert = require('assert')
const { promiseForEach } = require('..')

const TIMEOUT = 200

describe('@promiseForEach', () => {
  it('# promiseForEach(number)', async function () {
    let res = await promiseForEach(3, (value, index) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // console.log('    ' + value)
          assert.equal(index, value, 'value: ' + value)
          resolve(index)
        }, TIMEOUT);
      })
    })
    assert.ok(res === 2, 'res: ' + JSON.stringify(res))
  })

  it('# promiseForEach(object)', async function () {
    let test = { one: 'qqq', two: 456 }
    let res = await promiseForEach(test, (value, key) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // console.log('    ' + value)
          assert.strictEqual(test[key], value)
          resolve(value)
        }, TIMEOUT);
      })
    })
    assert.ok(res === 456, 'res: ' + res)
  })

  it('# promiseForEach(array)', async function () {
    let test = [null, 666]
    let res = await promiseForEach(test, (value, index) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // console.log('    ' + value)
          assert.strictEqual(test[index], value)
          resolve(value)
        }, TIMEOUT);
      })
    })
    assert.ok(res === 666)
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
          }, TIMEOUT);
        })
      })
    } catch(err) {
      assert.ok(err.message === '123')
    }
  })
})
