var binders = {};
var simpleBinders = {};

var util = require('../util');

var register = function(type, fn, simple) {
  if (typeof type !== 'string' || typeof fn !== 'function') {
    throw new Error('type and fn is required!');
  }
  binders[type] = fn;
  if (simple === true) {
    simpleBinders[type] = fn;
  }
};

var basicBinders = require('./basic');

for (var name in basicBinders) {
  if (basicBinders.hasOwnProperty(name)) {
    register(name, basicBinders[name], true);
  }
}

register('if', require('./if'));
register('repeat', require('./repeat'));

module.exports = {
  register: register,
  create: function(options, model) {
    var type = options.type;

    var constructor = binders[type];

    if (constructor) {
      var el = options.el;
      var extra = options.extra;
      var property = options.property;
      var fn = options.fn;

      var valueFn;

      if (fn) {
        valueFn = function() {
          return fn.call(model);
        };
      } else if (!fn && property) {
        valueFn = function() {
          return util.getPath(model, property);
        };
      }

      var binder = new constructor(el, valueFn, extra);

      binder.model = model;

      return binder;
    }
  },
  get: function(name) {
    return binders[name];
  },
  isBinder: function(name) {
    return binders.hasOwnProperty(name);
  },
  isSimpleBinder: function(name) {
    return simpleBinders.hasOwnProperty(name);
  }
};