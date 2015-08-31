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
register('model', require('./model'));

module.exports = {
  register: register,
  create: function(options, context, reactive) {
    var type = options.type;
    var binderOptions = options.options || {};

    var refs = reactive.refs;

    var constructor = binders[type];

    if (type === 'prop' && binderOptions.key) {
      if (binders[binderOptions.key]) {
        constructor = binders[binderOptions.key];
      } else {
        constructor = binders.attr;
      }
    }

    if (constructor) {
      var el = options.el;
      if (typeof el === 'string') {
        el = refs[el];
      }

      return new constructor(el, binderOptions, context);
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