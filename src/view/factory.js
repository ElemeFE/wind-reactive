var registerMap = {};

module.exports = {
  register: function(tag, fn) {
    if (typeof tag !== 'string' || typeof fn !== 'function') return;
    registerMap[tag] = fn;
  },
  create: function(tag, options, content) {
    if (typeof tag !== 'string') return null;

    var fn = registerMap[tag];
    if (typeof fn === 'function') {
      return new fn(options);
    }

    return null;
  }
};