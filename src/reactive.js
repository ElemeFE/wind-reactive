var create = require('./create');
var binder = require('./binder');
var util = require('./util');

var getBinder = binder.get;

var updateBinder = function(type, el, value, extra, model) {
  var fn = getBinder(type);
  if (fn && el) {
    fn.call(model, el, value, extra);
  }
};

var Reactive = function(template, model, options) {
  if (!(this instanceof Reactive)) {
    return new Reactive(template, model, options);
  }

  if (typeof template === 'string') throw new Error('template is not compiled.');
  options = options || {};

  this.template = template;
  this.model = model;

  var adapter = options.adapter;

  if (typeof adapter === 'function') {
    this.adapter = new adapter(model);
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
  var model = this.model;
  var binders = template.binders;
  var refs = this.refs;
  var bindings = [];

  for (var i = 0, j = binders.length; i < j; i++) {
    var temp = binders[i];
    if (!binder.isSimpleBinder(temp.type)) {
      var binding = binder.create(temp, model);

      if (typeof binding.element === 'string') {
        binding.element = refs[binding.element];
      }

      if (binding.extra && typeof binding.extra.refNode === 'string') {
        binding.extra.refNode = refs[binding.extra.refNode];
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
  var model = this.model;
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
  var extra = binding.extra;
  var property = binding.property;
  var fn = binding.fn;

  if (typeof element === 'string') {
    element = refs[element];
  }

  if (!element) return;

  var value;

  if (binding.type === 'event') {
    value = fn.bind(model);
  } else {
    if (typeof fn === 'function') {
      value = fn.call(model);
    } else if (property) {
      value = model[property];
    } else {
      throw new Error('invalid binder');
    }
  }

  updateBinder(type, element, value, extra, model);
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
  var model = this.model;
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
    var current = model;
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
  return util.getPath(this.model, prop);
};

module.exports = Reactive;