module.exports = function (iterable, callback) {
  let count = 0
  let length = 0
  let o
  let keys
  if (typeof iterable === 'number' && Math.floor(iterable) === iterable) {
    length = iterable
    o = []
    for (let i = 0; i < iterable; i++) o[i] = i
  } else if (typeof iterable === 'object' && iterable !== null && Array.isArray(iterable)) {
    o = iterable
    length = iterable.length
  } else if (typeof iterable === 'object' && iterable !== null && !Array.isArray(iterable)) {
    o = iterable
    keys = Object.keys(iterable)
    length = keys.length
  } else throw new Error('function promiseForEach (iterable: number | Array<any> | object, callback: (value?: any, key?: number | string) => Promise<any>): Promise<any>')

  return (function tmp () {
    return callback(keys ? o[keys[count]] : o[count], keys ? keys[count] : count).then(() => {
      // if (++count < length - 1) return tmp()
      // else return callback(keys ? o[keys[count]] : o[count], keys ? keys[count] : count)
      if (++count < length) return tmp()
      else return void 0
    })
  })()
}
