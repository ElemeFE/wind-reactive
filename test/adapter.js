var observe = require('./lib/observe');
var Adapter = require('../src/adapter');

var MyAdapter = function() {
  Adapter.apply(this, arguments);
};

MyAdapter.prototype = new Adapter();
MyAdapter.prototype.constructor = MyAdapter;

MyAdapter.prototype.subscribe = function(prop, fn) {
  observe(this.object, prop, fn);
};

MyAdapter.prototype.unsubscribe = function() {
};

var Reactive = require('../src/reactive');
var compile = require('wind-compiler').compile;

describe('adapter unit test', function() {
  this.slow(2000);

  it('should works', function(done) {
    var template = '<div>{{text}}</div>';
    var model = {
      text: 'text'
    };

    var view = Reactive(compile(template), model, {
      adapter: MyAdapter
    });

    view.element.innerHTML.should.equal('text');

    model.text = 'aaa';

    setTimeout(function() {
      view.element.innerHTML.should.equal('aaa');

      done();
    }, 100);
  });
});