const fs = require('fs')
const path = require('path')

exports.mdSync = function mdSync (p) {
  const dir = path.dirname(p)
  if (!fs.existsSync(dir)) {
    mdSync(dir)
  } else {
    if (!fs.statSync(dir).isDirectory()) throw new Error(`"${path.resolve(dir)}" is not a directory.`)
  }
  fs.mkdirSync(p)
}

exports.md = function md (p, cb) {
  if (typeof cb !== 'function') cb = void 0
  const promiseCallback = (resolve, reject) => {
    const dir = path.dirname(p)
    if (!fs.existsSync(dir)) {
      md(dir, (err) => {
        if (err) {
          if (cb) cb(err)
          else reject(err)
          return
        }
        fs.mkdir(p, err => {
          if (err) {
            if (cb) cb(err)
            else reject(err)
            return
          }
          if (cb) cb(null)
          else resolve()
        })
      })
    } else {
      fs.stat(dir, (err, stats) => {
        if (err) {
          if (cb) cb(err)
          else reject(err)
          return
        }
        if (!stats.isDirectory()) {
          const e = new Error(`"${path.resolve(dir)}" is not a dictory.`)
          if (cb) cb(e)
          else reject(e)
          return
        }
        fs.mkdir(p, err => {
          if (err) {
            if (cb) cb(err)
            else reject(err)
            return
          }
          if (cb) cb(null)
          else resolve()
        })
      })
    }
  }
  return cb ? promiseCallback() : new Promise(promiseCallback)
}
