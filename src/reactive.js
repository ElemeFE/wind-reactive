var create = require('./create');
var binder = require('./binder');
var util = require('./util');
var getFilter = require('./filter').getFilter;

var getBinder = binder.get;

var updateBinder = function(type, el, value, key, context) {
  var fn = getBinder(type);
  if (fn && el) {
    fn.call(context, el, value, key);
  }
};

var config = require('./config');

var Reactive = function(template, context, options) {
  if (!(this instanceof Reactive)) {
    return new Reactive(template, context, options);
  }

  if (typeof template === 'string') throw new Error('template is not compiled.');
  options = options || {};

  this.template = template;
  this.context = context;

  this.context.$getFilter = function(name) {
    var filter = getFilter(name);
    if (!filter) {
      console.warn('NO FILTER FOUND:' + name);
      return function(value) {
        return value;
      };
    }
    return filter;
  };

  var adapter = options.adapter || config.getDefaultAdapter();

  if (typeof adapter === 'function') {
    this.adapter = new adapter(context);
  } else {
    this.adapter = adapter;
  }

  var refs = this.refs = {};

  var children = [];

  this.element = create(template.tree, refs, function(component) {
    children.push(component);
  });

  this.children = children;

  this.initBinding();

  var bindings = this.bindings;
  for (var i = 0, j = bindings.length; i < j; i++) {
    this.updateBinding(bindings[i]);
  }
};

Reactive.prototype.initBinding = function() {
  var template = this.template;
  var context = this.context;
  var binders = template.binders;
  var refs = this.refs;
  var bindings = [];

  for (var i = 0, j = binders.length; i < j; i++) {
    var temp = binders[i];

    var isSimple = binder.isSimpleBinder(temp.type);
    if (temp.type === 'prop' && temp.options && temp.options.key) {
      isSimple = !binders[temp.options.key];
      if (isSimple) {
        temp.type = 'attr';
      }
    }

    if (!isSimple) {
      var binding = binder.create(temp, context, this);

      if (typeof binding.element === 'string') {
        binding.element = refs[binding.element];
      }

      if (temp.options && typeof temp.options.refNode === 'string') {
        binding.refNode = refs[temp.options.refNode];
      }

      bindings.push(binding);
    } else {
      bindings.push(temp);
    }
  }

  this.bindings = bindings;

  if (this.adapter) {
    this.initSubscribe();
  }
};

Reactive.prototype.initSubscribe = function() {
  var template = this.template;
  var adapter = this.adapter;
  var propertyBindings = template.propertyBindings || {};
  var bindings = this.bindings;

  var self = this;

  var subscribe = function (prop, binding) {
    adapter.subscribe(prop, function () {
      self.updateBinding(binding);
    });
  };

  for (var prop in propertyBindings) {
    if (propertyBindings.hasOwnProperty(prop)) {
      var array = propertyBindings[prop];
      if (array instanceof Array) {
        for (var i = 0, j = array.length; i < j; i++) {
          var item = array[i];
          if (typeof item === 'number') {
            var binding = bindings[item];
            subscribe(prop, binding);
          }
        }
      } else if (typeof array === 'number') {
        subscribe(prop, bindings[array]);
      }
    }
  }
};

Reactive.prototype.updateBinding = function(binding) {
  var bindings = this.bindings;
  var context = this.context;
  var refs = this.refs;

  if (typeof binding === 'number') {
    binding = bindings[binding];
  }

  if (!binding) return;

  if (typeof binding !== 'function' && binding && binding.update) {
    binding.update();

    return;
  }

  var type = binding.type;
  var element = binding.el;
  var options = binding.options || {};
  var property = binding.property;
  var fn = options.fn;

  if (typeof element === 'string') {
    element = refs[element];
  }

  if (!element) return;

  var value;

  if (binding.type === 'event') {
    value = fn.bind(context);
  } else {
    if (typeof fn === 'function') {
      value = fn.call(context);
    } else if (property) {
      value = context[property];
    }
  }

  updateBinder(type, element, value, options.key, context);
};

Reactive.prototype.updateByProperty = function(prop) {
  var bindings = (this.template.propertyBindings || {})[prop];

  if (bindings instanceof Array) {
    for (var i = 0, j = bindings.length; i < j; i++) {
      var binder = bindings[i];
      this.updateBinding(binder);
    }
  } else if (bindings && bindings.type) {
    this.updateBinding(bindings);
  }
};

Reactive.prototype.update = function() {
  var dirtyProps = this.dirtyProps;
  var propertyBindings = this.template.propertyBindings || {};

  if (!dirtyProps || !dirtyProps.length) return;

  for (var i = 0, j = dirtyProps.length; i < j; i++) {
    var property = dirtyProps[i];
    var binders = propertyBindings[property];

    this.updateByProperty(property, binders);
  }
};

Reactive.prototype.markDirty = function(prop) {
  var dirtyProps = this.dirtyProps;
  if (!dirtyProps) {
    dirtyProps = this.dirtyProps = [];
  }

  if (dirtyProps.indexOf(prop) === -1) {
    dirtyProps.push(prop);
  }

  clearTimeout(this.updateTimer);

  var self = this;

  this.updateTimer = setTimeout(function() {
    self.update();
    self.updateTimer = null;
  }, 16);
};

Reactive.prototype.set = function(prop, value) {
  var context = this.context;
  if (prop === undefined || prop === null) return;

  if (typeof prop === 'object') {
    var object = prop;
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        this.set(key, object[key]);
      }
    }
  } else {
    prop = prop || '';
    var paths = prop.split('.');
    var current = context;
    for (var i = 0, j = paths.length; i < j; i++) {
      var path = paths[i];
      if (!current) break;
      if (i === j - 1) {
        current[path] = value;
        this.markDirty(prop);
        break;
      }
      current = current[path];
    }
  }
};

Reactive.prototype.get = function(prop) {
  return util.getPath(this.context, prop);
};

module.exports = Reactive;