function isArray(o) {
  if (Array.isArray) return Array.isArray(o);
  return Object.prototype.toString.call(o) === '[object Array]';
}

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isDate(o) {
  return Object.prototype.toString.call(o) === '[object Date]';
}

function isFunction(o) {
  return typeof o === 'function';
}

function isString(o) {
  return typeof o === 'string';
}

function isNumber(o) {
  return typeof o === 'number';
}

function deepCopy (obj) {
  if (isFunction(obj)) return obj;
  if (typeof obj !== 'object' || obj === null) return obj;
  var o = isArray(obj) ? [] : {};
  for (var i in obj) {
    if (typeof obj[i] === 'object') o[i] = deepCopy(obj[i]);
    else o[i] = obj[i];
  }
  return o;
}

function __and(v, condition) {
  if (!isObject(condition)) throw new Error('Invalid condition ({&&}).');
  for (var op in condition) {
    if (op === '$not') {
      if (__and(v, condition[op])) {
        return false;
      }
    } else if (op === '$gt') {
      if (!(v > condition[op])) {
        return false;
      }
    } else if (op === '$lt') {
      if (!(v < condition[op])) {
        return false;
      }
    } else if (op === '$lte') {
      if (!(v <= condition[op])) {
        return false;
      }
    } else if (op === '$gte') {
      if (!(v >= condition[op])) {
        return false;
      }
    } else if (op === '$ne') {
      if (!(v !== condition[op])) {
        return false;
      }
    } else if (op === '$eq') {
      if (!(v === condition[op])) {
        return false;
      }
    } else if (op === '$exists') {
      if (!((v !== undefined) === Boolean(condition[op]))) {
        return false;
      }
    } else if (op === '$in') {
      if (!(condition[op].indexOf(v) !== -1)) {
        return false;
      }
    } else if (op === '$nin') {
      if (!(condition[op].indexOf(v) === -1)) {
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

function _and(o, condition) {
  if (!isObject(condition)) throw new Error('Invalid condition (&&).');
  for (var key in condition) {
    if (key === '$or') {
      if (!$or(o, condition[key])) {
        return false;
      }
    } else if (key === '$and') {
      if (!$and(o, condition[key])) {
        return false;
      }
    } else if (key === '$nor') {
      if (!$nor(o, condition[key])) {
        return false;
      }
    } else if (key === '$where') {
      if (isString(condition[key])) {
        var wrap = new Function('return ' + condition[key] + ';');
        var result = wrap.call(o);
        if (isFunction(result)) {
          if (!result.call(o)) {
            return false;
          }
        } else {
          if (!result) {
            return false;
          }
        }
      } else if (isFunction(condition[key])) {
        if (!condition[key].call(o)) {
          return false;
        }
      }
    } else if (isObject(condition[key])) {
      if (!__and(o[key], condition[key])) {
        return false;
      }
    } else if (isFunction(condition[key])) {
      if (!condition[key].call(o[key], o[key])) {
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

function $or(o, condition) {
  if (!isArray(condition)) throw new Error('Invalid condition ($or).');
  for (var i = 0; i < condition.length; i++) {
    if (_and(o, condition[i])) {
      return true;
    }
  }
  return false;
}

function $nor(o, condition) {
  if (!isArray(condition)) throw new Error('Invalid condition ($nor).');
  for (var i = 0; i < condition.length; i++) {
    if (_and(o, condition[i])) {
      return false;
    }
  }
  return true;
}

function $and(o, condition) {
  if (!isArray(condition)) throw new Error('Invalid condition ($and).');
  for (var i = 0; i < condition.length; i++) {
    if (!_and(o, condition[i])) {
      return false;
    }
  }
  return true;
}

function sortFunctionFactory(key, flag) {
  return function (a, b) {
    if (isNumber(a[key]) && isNumber(b[key])) {
      if (isNaN(a[key]) || isNaN(b[key])) return -1;
      return flag > 0 ? (a[key] - b[key]) : (b[key] - a[key]);
    }

    if (isString(a[key]) && isString(b[key])) {
      var al = a[key].length;
      var bl = b[key].length;
      var length = al < bl ? al : bl;
      for (var x = 0; x < length; x++) {
        if (a[key].charCodeAt(x) !== b[key].charCodeAt(x)) {
          return flag > 0 ? (a[key].charCodeAt(x) - b[key].charCodeAt(x)) : (b[key].charCodeAt(x) - a[key].charCodeAt(x));
        }
      }
      return flag > 0 ? (a[key].length - b[key].length) : (b[key].length - a[key].length);
    }

    if (isDate(a[key]) && isDate(b[key])) {
      return flag > 0 ? (a[key].getTime() - b[key].getTime()) : (b[key].getTime() - a[key].getTime());
    }

    return -1;
  };
}

function objectArrayFind(arr, query, projection, sort) {
  var result = [];
  var i = 0;
  for (i = 0; i < arr.length; i++) {
    var o = arr[i];

    if (isObject(query)) {
      if (_and(o, query)) {
        result.push(deepCopy(o));
      }
    } else {
      result.push(deepCopy(o));
    }
  }

  if (isObject(projection) && Object.keys(projection).length !== 0) {
    for (i = 0; i < result.length; i++) {
      var doc = result[i];

      var mode = projection[Object.keys(projection)[0]]
      if (mode !== 0 && mode !== 1) throw new Error('Projection value must be 0 or 1.');
      if (mode === 1) {
        if (projection._id === undefined) {
          projection._id = 1;
        }
      }
      var newDoc = {};
      for (var key in projection) {
        if (projection[key] !== 0 && projection[key] !== 1) throw new Error('Projection value must be 0 or 1.');
        if (projection[key] !== mode) throw new Error('Projection cannot have a mix of inclusion and exclusion.');

        if (mode === 0) {
          delete doc[key]
        } else {
          newDoc[key] = doc[key]
        }
      }
      if (mode === 1) {
        result[i] = newDoc;
      }
    }
  }

  if (isObject(sort) && Object.keys(sort).length !== 0) {
    var keys = Object.keys(sort);
    var ignore = [];
    for (i = 0; i < result.length; i++) {
      var valid = true;
      for (j = 0; j < keys.length; j++) {
        if (!result[i][keys[j]]) {
          valid = false;
          break;
        }
      }
      if (!valid) {
        var spl = result.splice(i, 1);
        ignore.push(spl[0]);
      }
    }

    for (i = keys.length - 1; i >= 0; i--) {
      var key = keys[i];
      
      if (sort[key] === 1 || sort[key] === -1) {
        result.sort(sortFunctionFactory(key, sort[key]));
      } else {
        throw new Error('Sort value must be -1 or 1.');
      }
    }
    result = result.concat(ignore);
  }
  return result;
}

exports.objectArrayFind = objectArrayFind;
