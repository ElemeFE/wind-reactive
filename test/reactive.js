var Reactive = require('../src/reactive');

describe('Reactive unit test', function() {
  describe('basic usage', function() {
    it('should return a view object', function() {
      var tree = {
        $tag: 'div',
        $ref: 'field',
        className: 'formfield',
        $content: [{
          $tag: 'label',
          $ref: 'label'
        }, {
          $tag: 'input',
          $ref: 'editor'
        }, {
          $tag: 'div',
          className: 'formfield-hint',
          $ref: 'hint',
          $content: [{
            $tag: 'span',
            $ref: 'message'
          }]
        }]
      };

      var binders = [{
        type: 'text',
        el: 'label',
        property: 'label'
      }, {
        type: 'attr',
        el: 'editor',
        $ref: 'placeholder',
        property: 'placeholder'
      }, {
        type: 'html',
        el: 'message',
        property: 'message'
      }, {
        type: 'class',
        $ref: 'validate-error',
        el: 'field',
        fn: function() {
          return this.hintType === 'error';
        }
      }, {
        type: 'class',
        $ref: 'icon-dot-error',
        el: 'message',
        fn: function() {
          return this.hintType === 'error';
        }
      }];

      var template = {
        tree: tree,
        binders: binders,
        propertyBindings: {
          label: 0,
          placeholder: 1,
          message: 2,
          hintType: [3, 4]
        }
      };

      var view = Reactive(template, {
        label: 'test',
        placeholder: 'test',
        message: 'test...',
        hintType: 'error'
      });

      //console.log(view.element);
    });
  });

  describe('should get/set normal property', function() {
    var template = {
      tree: {
        $tag: 'div'
      },
      binders: []
    };

    var model = {
      label: 'test'
    };

    it('should get model property', function() {
      var view = Reactive(template, model);

      view.get('label').should.equal('test');
    });

    it('should update model property', function() {
      var view = Reactive(template, model);

      var updatedValue = 'test2';
      view.set('label', updatedValue);
      model.label.should.equal(updatedValue);
    });
  });

  describe('should get/set path property', function() {
    var template = {
      tree: {
        $tag: 'div'
      },
      binders: []
    };

    var model = {
      object: {
        label: 'test'
      }
    };

    it('should get path property', function() {
      var view = Reactive(template, model);

      view.get('object.label').should.equal('test');

      (function() {
        view.get('b.c');
        view.get('object.model.c');
      }).should.not.throw();
    });

    it('should update path property', function() {
      var view = Reactive(template, model);

      var updatedValue = 'test2';
      view.set('object.label', updatedValue);
      model.object.label.should.equal(updatedValue);

      (function() {
        view.set();
        view.set('object2.label', '');
        view.set('object2.label');
      }).should.not.throw();
    });
  });

  describe('dom update', function() {
    this.slow(1000);

    it('should execute binders after update model property', function(done) {
      var template = {
        tree: {
          $tag: 'div',
          $ref: 'element'
        },
        binders: [{
          type: 'text',
          el: 'element',
          property: 'label'
        }],
        propertyBindings: {
          label: [ 0 ]
        }
      };

      var model = {
        label: 'test'
      };

      var view = Reactive(template, model);

      var updatedValue = 'test2';
      view.set('label', updatedValue);

      setTimeout(function() {
        view.element.textContent.should.equal(updatedValue);
        done();
      }, 50);
    });
  });

});