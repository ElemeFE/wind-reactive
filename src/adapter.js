var util = require('./util');

var Adapter = function(object) {
  if (!(this instanceof Adapter)) {
    return new Adapter(object);
  }

  this.object = object;
};

Adapter.prototype = {
  constructor: Adapter,

  subscribe: function(prop, fn) {
  },

  unsubscribe: function(prop, fn) {
  },

  unsubscribeAll: function() {
  },

  set: function(prop, value) {
    util.setPath(this.object, prop, value);
  },

  get: function(prop) {
    return util.getPath(this.object, prop);
  }
};

module.exports = Adapter;