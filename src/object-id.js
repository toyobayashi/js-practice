(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.generateObjectId = factory());
})(this, (function() {
  var index = ~~(Math.random() * 0xffffff);
  var PROCESS_UNIQUE = new Uint8Array(5);
  for (var i = 0; i < 5; ++i) {
    PROCESS_UNIQUE[i] = Math.floor(Math.random() * 256);
  }

  function createObjectIdBuffer(time) {
    time = time || ~~(Date.now() / 1000);
    var buffer = new Uint8Array(12);

    buffer[3] = time & 0xff;
    buffer[2] = (time >> 8) & 0xff;
    buffer[1] = (time >> 16) & 0xff;
    buffer[0] = (time >> 24) & 0xff;

    buffer[4] = PROCESS_UNIQUE[0];
    buffer[5] = PROCESS_UNIQUE[1];
    buffer[6] = PROCESS_UNIQUE[2];
    buffer[7] = PROCESS_UNIQUE[3];
    buffer[8] = PROCESS_UNIQUE[4];

    buffer[11] = index & 0xff;
    buffer[10] = (index >> 8) & 0xff;
    buffer[9] = (index >> 16) & 0xff;

    index = (index + 1) % 0xffffff;

    var result = '';

    for (var i = 0; i < buffer.length; i++) {
      var hex = buffer[i].toString(16);
      result += hex.length === 1 ? ('0' + hex) : hex;
    }

    return result;
  }

  return function generateObjectId(obj) {
    if (typeof obj === 'number') {
      return createObjectIdBuffer(obj);
    }
    if (typeof obj === 'string' && obj.length === 12) {
      var result = '';
      for (var i = 0; i < obj.length; i++) {
        var hex = (obj.charCodeAt(i) & 0xff).toString(16);
        result += hex.length === 1 ? ('0' + hex) : hex;
      }
      return result;
    }
    if (typeof obj === 'string' && obj.length === 24 && /^[0-9][a-f][A-F]$/.test(obj)) {
      return obj;
    }
    
    return createObjectIdBuffer();
  };
}));
