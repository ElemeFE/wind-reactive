var parse = require('wind-compiler').compile;
var Reactive = require('../src/reactive');

describe('repeat binder unit test', function() {
  this.slow(2000);

  describe('basic use, no update', function() {
    it('should have repeat binder in parentNode', function() {
      var html = '<ul><li r-repeat="item in items">{{item.text}}</li></ul>';
      var template = parse(html);

      var view = Reactive(template, {
        items: [{ text: 'a' }, { text: 'b' }, { text: 'c' }]
      });

      view.element.querySelectorAll('li').length.should.equal(3);
    });

    it('should create multi repeat binder', function() {
      var html = '<div><ul><li r-repeat="item in items">{{item.text}}</li></ul><ul><li r-repeat="item in items">{{item.text}}</li></ul></div>';
      var template = parse(html);

      var view = Reactive(template, {
        items: [{ text: 'a' }, { text: 'b' }, { text: 'c' }]
      });

      view.element.querySelectorAll('li').length.should.equal(6);
    });

    it('should create nested repeat binder', function() {
      var html = '<div><ul><li r-repeat="item in items"><ul><li r-repeat="item in item.items">{{item.text}}</li></ul>{{item.text}}</li></ul></div>';
      var template = parse(html);

      var view = Reactive(template, {
        items: [{ text: 'a', items: [{ text: 'a1' }, { text: 'a2' }, { text: 'a3' }] }, { text: 'b' }, { text: 'c' }]
      });

      view.element.querySelectorAll('div > ul > li').length.should.equal(3);

      view.element.querySelectorAll('div > ul > li > ul > li').length.should.equal(3);
    });
  });

  describe('basic update', function() {
    it('should update when array change', function(done) {
      var html = '<ul><li r-repeat="item in items">{{item.text}}</li></ul>';
      var template = parse(html);

      //console.log(template);

      var view = Reactive(template, {
        items: [{ text: 'a' }, { text: 'b' }, { text: 'c' }]
      });

      view.set('items', [{ text: 'a' }]);

      setTimeout(function() {
        view.element.querySelectorAll('li').length.should.equal(1);

        done();
      }, 100);
    });

    it('should update reserve old dom when update', function(done) {
      var html = '<ul><li r-repeat="item in items track by item.text">{{item.text}}</li></ul>';
      var template = parse(html);

      var view = Reactive(template, {
        items: [{ text: 'a' }, { text: 'b' }, { text: 'c' }]
      });

      view.set('items', [{ text: 'a' }, { text: 'b' }]);

      var lis = view.element.querySelectorAll('li');
      lis[0].tag = 0;
      lis[1].tag = 1;

      setTimeout(function() {
        view.element.querySelectorAll('li').length.should.equal(2);

        lis = view.element.querySelectorAll('li');
        lis[0].tag.should.equal(0);
        lis[1].tag.should.equal(1);

        done();
      }, 100);
    });
  });
});