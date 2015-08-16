var util = require('../util');

var State = function(options) {
  this.$schema = {};
  this.$listeners = {};
  this.$set(options);
};

State.prototype = {
  constructor: State,

  $on: function(prop, listener) {
    var listeners = this.$listeners[prop];
    if (!listeners) {
      listeners = this.$listeners[prop] = [];
    }

    listeners.push(listener);
  },

  $off: function(prop, listener) {
    var listeners = this.$listeners[prop];
    if (listeners) {
      if (!listener) {
        this.$listeners[prop] = [];
      } else {
        var index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    }
  },

  $emit: function(prop) {
    var listeners = this.$listeners[prop];
    if (listeners) {
      for (var i = 0, j = listeners.length; i < j; i++) {
        var listener = listeners[i];
        listener.call(this, prop);
      }
    }
  },

  $set: function(prop, value) {
    if (!prop) return;
    if (typeof prop === 'string') {
      if (prop.indexOf('.') !== -1) {
        util.setPath(this, prop, value);
      }
      this[prop] = value;
    } else if (typeof prop === 'object') {
      for (var name in prop) {
        if (prop.hasOwnProperty(name)) {
          this.$set(name, prop[name]);
        }
      }
    }
  },

  $get: function(prop) {
    if (prop.indexOf('.') !== -1) {
      return util.getPath(this, prop);
    }
    return this[prop];
  }
};

module.exports = State;