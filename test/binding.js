var parse = require('wind-compiler').compile;
var Reactive = require('../src/reactive');

describe('binders unit test', function() {
  this.slow(1000);

  describe('text binder test', function() {
    var template = parse('<div [text]="label"></div>');
    var model = { label: 'test' };

    it('should execute text binders', function() {
      var view = Reactive(template, model);
      var element = view.element;
      element.innerHTML.should.equal('test');
    });

    it('should update text binders', function(done) {
      var view = Reactive(template, model);
      var element = view.element;

      view.set('label', 'aaa');
      setTimeout(function() {
        element.innerHTML.should.equal('aaa');
        done();
      }, 50);
    });
  });

  describe('html binder test', function() {
    var template = parse('<div [html]="label"></div>');
    var model = { label: '<b>test</b>' };

    it('should execute text binders', function() {
      var view = Reactive(template, model);
      var element = view.element;
      element.innerHTML.should.equal('<b>test</b>');
    });

    it('should update text binders', function(done) {
      var view = Reactive(template, model);
      var element = view.element;

      view.set('label', '<b>aaa</b>');
      setTimeout(function() {
        element.innerHTML.should.equal('<b>aaa</b>');
        done();
      }, 50);
    });
  });

  describe('class binder test', function() {
    var template = parse('<div [class]="test: isTest"></div>');
    var model = { isTest: true };

    it('should execute class binder', function() {
      var view = Reactive(template, model);
      var element = view.element;
      element.className.should.equal('test');
    });

    it('should update class binder', function(done) {
      var view = Reactive(template, model);
      var element = view.element;
      view.set('isTest', false);

      setTimeout(function() {
        element.className.should.equal('');
        done();
      }, 50);
    });
  });

  describe('attr binder test', function() {
    var template = parse('<div [attr]="test: testValue"></div>');
    var model = { testValue: 'test' };

    it('should execute class binder', function() {
      var view = Reactive(template, model);
      var element = view.element;
      element.test.should.equal('test');
    });

    it('should update class binder', function(done) {
      var view = Reactive(template, model);
      var element = view.element;
      view.set('testValue', 'aaa');

      setTimeout(function() {
        element.test.should.equal('aaa');
        done();
      }, 50);
    });
  });

  describe('show binder test', function() {
    var template = parse('<div [show]="visible"></div>');
    var model = { visible: true };

    it('should execute class binder', function() {
      var view = Reactive(template, model);
      var element = view.element;
      element.style.display.should.equal('');
    });

    it('should update class binder', function(done) {
      var view = Reactive(template, model);
      var element = view.element;
      view.set('visible', false);

      setTimeout(function() {
        element.style.display.should.equal('none');
        done();
      }, 50);
    });
  });

  describe('hide binder test', function() {
    var template = parse('<div [hide]="visible"></div>');
    var model = { hidden: false };

    it('should execute class binder', function() {
      var view = Reactive(template, model);
      var element = view.element;
      element.style.display.should.equal('');
    });

    it('should update class binder', function(done) {
      var view = Reactive(template, model);
      var element = view.element;
      view.set('visible', true);

      setTimeout(function() {
        element.style.display.should.equal('none');
        done();
      }, 50);
    });
  });

  describe('event binder test', function() {
    var template = parse('<div on-click="test()"></div>');
    var listener = sinon.spy();
    var model = {
      a: 'aaa',
      test: listener
    };

    var view = Reactive(template, model);
    document.body.appendChild(view.element);
    view.element.click();

    listener.should.calledOnce;
  });
});