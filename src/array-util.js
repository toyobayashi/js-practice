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

function isString(o) {
  return typeof o === 'string';
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

// function __or(v, condition) {
//   if (!isArray(condition)) throw new Error('Invalid condition ({||}).');
//   for (var i = 0; i < condition.length; i++) {
//     if (__and(v, condition[i])) {
//       return true;
//     }
//   }
//   return false;
// }

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

function objectArrayFind(arr, query, projection, sort) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    var o = arr[i];

    if (_and(o, query)) {
      var doc = deepCopy(o);
      if (isObject(projection) && Object.keys(projection).length !== 0) {
        var mode = -1;
        var newDoc = {};
        for (var key in projection) {
          if (projection[key] !== 0 && projection[key] !== 1) throw new Error('Projection value must be 0 or 1.');
          if (mode === -1) {
            mode = projection[key];
            if (mode === 1) {
              if (projection._id === undefined) {
                projection._id = 1;
              }
            }
          }
          if (projection[key] !== mode) throw new Error('Projection cannot have a mix of inclusion and exclusion.');

          if (mode === 0) {
            delete doc[key]
          } else {
            newDoc[key] = doc[key]
          }
        }
        if (mode === 0) {
          result.push(doc);
        } else {
          result.push(newDoc);
        }
      } else {
        result.push(doc);
      }
    }
  }

  return result;
}

exports.objectArrayFind = objectArrayFind;
