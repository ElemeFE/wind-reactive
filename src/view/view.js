var State = require('./state');
var Reactive = require('../reactive');
var create = require('../create');

var View = function(props) {
  this.subViews = [];
  this.innerViews = [];
  this.mounted = false;

  this.state = new State();

  this.set(props);

  // TODO
  this.initContent();
};

View.prototype = {
  constructor: View,

  initContent: function() {},

  set: function(prop, value) {
    return this.state.$set(prop, value);
  },

  get: function(prop) {
    return this.state.$get(prop);
  },

  mount: function() {
    this.mounted = true;
  },

  unmount: function() {
  },

  render: function() {
    if (!this.template) {
      throw new Error('template is empty!');
    }

    var self = this;

    var view = Reactive(this.template, this.state, function(view) {
      self.innerViews.push(view);
    });

    this.refs = view.refs;

    return view.element;
  },

  update: function() {
  }
};

module.exports = View;