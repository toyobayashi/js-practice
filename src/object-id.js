module.exports = (function () {
  var index = ~~(Math.random() * 0xffffff);
  var PROCESS_UNIQUE = new Uint8Array(5);
  for (var x = 0; x < 5; x++) {
    PROCESS_UNIQUE[x] = Math.floor(Math.random() * 256);
  }

  function ObjectId(obj) {
    var i = 0;
    this.id = new Uint8Array(12);
    if (typeof obj === 'string' && /^[0-9a-fA-F]{24}$/.test(obj)) {
      for (i = 0; i < 24; i += 2) {
        this.id[i / 2] = parseInt(obj.substr(i, 2), 16);
      }
    } else if (typeof obj === 'string' && obj.length === 12) {
      for (i = 0; i < 12; i++) {
        this.id[i] = (obj.charCodeAt(i) & 0xff);
      }
    } else {
      var time = typeof obj === 'number' ? obj : ~~(Date.now() / 1000);
      this.id[3] = time & 0xff;
      this.id[2] = (time >> 8) & 0xff;
      this.id[1] = (time >> 16) & 0xff;
      this.id[0] = (time >> 24) & 0xff;

      this.id[4] = PROCESS_UNIQUE[0];
      this.id[5] = PROCESS_UNIQUE[1];
      this.id[6] = PROCESS_UNIQUE[2];
      this.id[7] = PROCESS_UNIQUE[3];
      this.id[8] = PROCESS_UNIQUE[4];

      this.id[11] = index & 0xff;
      this.id[10] = (index >> 8) & 0xff;
      this.id[9] = (index >> 16) & 0xff;

      index = (index + 1) % 0xffffff;
    }

    Object.defineProperties(this, {
      __id: {
        enumerable: true,
        get: function () {
          return this.toString();
        }
      },
      generationTime: {
        enumerable: true,
        get: function() {
          return this.id[3] | (this.id[2] << 8) | (this.id[1] << 16) | (this.id[0] << 24);
        },
        set: function(value) {
          if (typeof value !== 'number') throw new Error('Argument must be a number.');
          this.id[3] = value & 0xff;
          this.id[2] = (value >> 8) & 0xff;
          this.id[1] = (value >> 16) & 0xff;
          this.id[0] = (value >> 24) & 0xff;
        }
      },
      processUnique: {
        enumerable: true,
        get: function () {
          return this.toString().substring(8, 18);
        }
      },
      index: {
        enumerable: true,
        get: function () {
          return parseInt(this.toString().substring(18), 16);
        }
      }
    });
  }

  Object.defineProperties(ObjectId.prototype, {
    toString: {
      enumerable: true,
      writable: false,
      value: function () {
        var result = '';
        var hex = '';
        for (var i = 0; i < this.id.length; i++) {
          hex = this.id[i].toString(16);
          result += hex.length === 1 ? ('0' + hex) : hex;
        }
        return result;
      }
    }
  });

  Object.defineProperties(ObjectId, {
    new: {
      enumerable: true,
      writable: false,
      value: function (obj) {
        return new ObjectId(obj);
      }
    },
    newString: {
      enumerable: true,
      writable: false,
      value: function (obj) {
        return new ObjectId(obj).toString();
      }
    }
  });

  return ObjectId;
})();
