require('./carousel');

var Reactive = require('../../src/reactive');
var factory = require('../../src/view/factory');
var compile = require('wind-compiler').compile;

describe('View unit test', function() {

  describe('Basic View', function() {
    it('should create carousel', function() {
      var carousel = factory.create('r-carousel', {
        content: [factory.create('r-slide', {
          content: [{
            $tag: 'img'
          }]
        }), factory.create('r-slide', {
          content: [{
            $tag: 'img'
          }]
        }), factory.create('r-slide', {
          content: [{
            $tag: 'img'
          }]
        })]
      });

      var dom = carousel.render();

      //TODO make this test works
    });
  });

  describe('Nested View', function() {
    it('should create nested view', function() {
      var template = compile('<div><r-carousel><r-slide><a>{{text}}</a></r-slide><r-slide><b>{{text2}}</b></r-slide><r-slide><c>{{text3}}</c></r-slide></r-carousel></div>');

      var model = {
        text: 1,
        text2: 2,
        text3: 3
      };

      var view = Reactive(template, model);

      var element = view.element;

      element.querySelector('a').innerText.should.equal('1');
      element.querySelector('b').innerText.should.equal('2');
      element.querySelector('c').innerText.should.equal('3');
    });
  });

  describe('controller bind or state bind?', function() {
    this.slow(2000);

    it('should create nested view', function(done) {
      var template = compile('<r-carousel ref="test" horizontal duration="300" [test]="testValue"></r-carousel>');

      var model = {
        testValue: 'test'
      };

      var view = Reactive(template, model);

      setTimeout(function() {
        view.refs['test'].get('test').should.equal('test');
        done();
      }, 50);
    });
  });
});