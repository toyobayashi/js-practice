/**
 * 顺序执行传入Promise.prototype.then()的回调函数
 * @param {any[]} arr 通常为函数数组，如果某项不是函数，则成为下一项函数的参数
 * @param {any} init 第一个回调函数接收的参数
 * @returns {Promise<any>} 返回Promise链最后的then返回的Promise
 */
function promiseQueue(arr, init) {
  var p = Promise.resolve(init);
  for (var i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'function') {
      p = p.then(arr[i]);
    } else {
      p = p.then((function (value) {
        return function () {
          return value;
        };
      })(arr[i]));
    }
  }
  return p;
}

/**
 * 顺序异步遍历
 * @param {number|any[]|{[key:string]:any}} iterable 数字或数组或对象
 * @param {(value:any,key:number|string,data:any)=>Promise<any>} callback 回调函数必须返回Promise<any>
 * @param {any} thisArg 回调函数的this
 * @returns {Promise<void>} 返回Promise<void>
 */
function promiseForEach(iterable, callback, thisArg) {
  if (typeof callback !== 'function') return Promise.reject(new Error('The second argument must be a function.'));

  var length = 0;
  var functionArray = [];
  var i = 0;

  if (typeof iterable === 'number' && Math.floor(iterable) === iterable) {
    var arr = [];
    for (i = 0; i < iterable; i++) {
      arr[i] = i;
    }
    return promiseForEach(arr, callback, thisArg || arr);
  }
  
  if (Object.prototype.toString.call(iterable) === '[object Array]') {
    length = iterable.length;
    for (i = 0; i < length; i++) {
      functionArray.push(function (o) {
        return callback.call(thisArg || iterable, o.value, o.key, o.data).then(function (_data) {
          return o.key + 1 !== length ? {
            key: o.key + 1,
            value: iterable[o.key + 1],
            data: _data
          } : _data;
        });
      });
    }
    return promiseQueue(functionArray, { key: 0, value: iterable[0], data: void 0 });
  } 
  
  if (Object.prototype.toString.call(iterable) === '[object Object]') {
    var keys = Object.keys(iterable);
    length = keys.length;
    for (i = 0; i < length; i++) {
      functionArray.push(function (o) {
        return callback.call(thisArg || iterable, o.value, o.key, o.data).then(function (_data) {
          return keys.indexOf(o.key) + 1 !== length ? {
            key: keys[keys.indexOf(o.key) + 1],
            value: iterable[keys[keys.indexOf(o.key) + 1]],
            data: _data
          } : _data;
        });
      });
    }
    return promiseQueue(functionArray, { key: keys[0], value: iterable[keys[0]], data: void 0 });
  }

  return Promise.reject(new Error('The first argument must be a number or an iterable object.'));
}

exports.promiseQueue = promiseQueue;
exports.promiseForEach = promiseForEach;
