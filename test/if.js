var compile = require('wind-compiler').compile;
var Reactive = require('../src/reactive');

describe('if binder unit test', function() {
  this.slow(2000);

  it('should execute right when initial value is false', function(done) {
    var template = compile('<div><a if="testA"></a></div>');

    var view = Reactive(template, {
      testA: false
    });

    view.element.querySelectorAll('a').length.should.equal(0);

    view.set('testA', true);

    setTimeout(function() {
      view.element.querySelectorAll('a').length.should.equal(1);
      done();
    }, 50);
  });

  it('should execute right when initial value is true', function(done) {
    var template = compile('<div><a if="testA"></a></div>');

    var view = Reactive(template, {
      testA: true
    });

    view.element.querySelectorAll('a').length.should.equal(1);

    view.set('testA', false);

    setTimeout(function() {
      view.element.querySelectorAll('a').length.should.equal(0);
      done();
    }, 50);
  });

  it('should execute right in a complicated situation', function(done) {
    var template = compile('<div><span></span><a if="testA"></a><b if="testB"></b><c if="testC"></c><d if="testD"></d></div>');

    var view = Reactive(template, {
      testA: true,
      testB: false,
      testC: true,
      testD: false
    });

    view.element.querySelectorAll('a').length.should.equal(1);
    view.element.querySelectorAll('b').length.should.equal(0);
    view.element.querySelectorAll('c').length.should.equal(1);
    view.element.querySelectorAll('d').length.should.equal(0);

    view.set('testA', false);
    view.set('testB', true);
    view.set('testC', false);
    view.set('testD', true);

    setTimeout(function() {
      view.element.querySelectorAll('a').length.should.equal(0);
      view.element.querySelectorAll('b').length.should.equal(1);
      view.element.querySelectorAll('c').length.should.equal(0);
      view.element.querySelectorAll('d').length.should.equal(1);

      done();
    }, 50);
  });
});