String.prototype.toBase64 = function () {
  if (this.length === 0) return ''
  const base64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let arr = this.match(/.{1,3}/g)
  let bin = arr.map(v => {
    let str = ''
    for (let j = 0; j < v.length; j++) {
      str += ('0000000' + v.charCodeAt(j).toString(2)).substr(-8)
    }
    return str
  })
  let end = bin[bin.length - 1].length === 8 ? '==' : (bin[bin.length - 1].length === 16 ? '=' : '')
  let binstr = bin.join('')
  let binarr = binstr.match(/.{1,6}/g)
  binarr[binarr.length - 1] = (binarr[binarr.length - 1] + '00000').substr(0, 6)
  return binarr.map(v => parseInt(v, 2)).map(v => base64Table[v]).join('') + end
}

String.prototype.fromBase64 = function () {
  if (this.length === 0) return ''
  const base64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let end = this.indexOf('=') === -1 ? 0 : ((this.length - this.indexOf('=') === 1) ? 1 : 2)
  let zeros = this.indexOf('=') === -1 ? 0 : ((this.length - this.indexOf('=') === 1) ? 2 : 4)
  let b64str = this.substr(0, this.length - end)
  let binstr = b64str.split('').map(v => base64Table.indexOf(v)).map(v => ('00000' + v.toString(2)).substr(-6)).join('')
  let binarr = binstr.substr(0, binstr.length - zeros).match(/.{8}/g)
  return binarr.map(v => String.fromCharCode(parseInt(v, 2))).join('')
}

console.log('frewgyaecb grwgfew qeqegt'.toBase64().fromBase64() === 'frewgyaecb grwgfew qeqegt')
console.log('1234'.toBase64().fromBase64() === '1234')
console.log('12345'.toBase64().fromBase64() === '12345')
console.log('123456'.toBase64().fromBase64() === '123456')
console.log('z'.toBase64())
