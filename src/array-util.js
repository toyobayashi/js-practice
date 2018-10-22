function isArray(o) {
  if (Array.isArray) return Array.isArray(o);
  return Object.prototype.toString.call(o) === '[object Array]';
}

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isFunction(o) {
  return typeof o === 'function';
}

function __and(v, condition) {
  if (!isObject(condition)) throw new Error('Invalid condition (&&).');
  for (var op in condition) {
    if (op === '$or') {
      if (!__or(v, condition[op])) {
        return false;
      }
    } else if (op === '$gt') {
      if (v <= condition[op]) {
        return false;
      }
    } else if (op === '$lt') {
      if (v >= condition[op]) {
        return false;
      }
    } else if (op === '$lte') {
      if (v > condition[op]) {
        return false;
      }
    } else if (op === '$gte') {
      if (v < condition[op]) {
        return false;
      }
    } else if (op === '$ne') {
      if (v === condition[op]) {
        return false;
      }
    } else if (op === '$eq') {
      if (v !== condition[op]) {
        return false;
      }
    }  else if (op === '$exists') {
      if ((v === undefined) === condition[op]) {
        return false;
      }
    } else if (op === '$in') {
      if (condition[op].indexOf(v) === -1) {
        return false;
      }
    } else if (op === '$nin') {
      if (condition[op].indexOf(v) !== -1) {
        return false;
      }
    } else if (op === '$regex') {
      if (!condition[op].test(v)) {
        return false;
      }
    }
  }
  return true;
}

function __or(v, condition) {
  if (!isArray(condition)) throw new Error('Invalid condition (||).');
  for (var i = 0; i < condition.length; i++) {
    if (__and(v, condition[i])) {
      return true;
    }
  }
  return false;
}

function _and(o, condition) {
  if (!isObject(condition)) throw new Error('Invalid condition (&&).');
  for (var key in condition) {
    if (key === '$or') {
      if (!_or(o, condition[key])) {
        return false;
      }
    } else if (isObject(condition[key])) {
      if (!__and(o[key], condition[key])) {
        return false;
      }
    } else if (isFunction(condition[key])) {
      if (!condition[key](o[key])) {
        return false;
      }
    } else if (!isArray(condition[key])) {
      if (condition[key] !== o[key]) {
        return false;
      }
    } 
  }
  return true;
}

function _or(o, condition) {
  if (!isArray(condition)) throw new Error('Invalid condition (||).');
  for (var i = 0; i < condition.length; i++) {
    if (_and(o, condition[i])) {
      return true;
    }
  }
  return false;
}

function objectArrayFind(arr, condition) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    var o = arr[i];

    if (_and(o, condition)) {
      result.push(o);
    }
  }
  return result;
}

exports.objectArrayFind = objectArrayFind;
