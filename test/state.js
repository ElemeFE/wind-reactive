var State = require('../src/view/state');

describe('state unit test', function() {
  describe('basic', function() {
    it('should init value with constructor', function() {
      var state = new State({
        a: 3
      });
      state.$get('a').should.equal(3);
    });

    it('should get basic value', function() {
      var state = new State();
      state.$set('a', 3);
      state.$get('a').should.equal(3);
    });

    it('should set basic value', function() {
      var state = new State({
        a: 3
      });
      state.$set('a', 2);
      state.$get('a').should.equal(2);
    });

    it('should get path value', function() {
      var state = new State({
        a: { a1: 2 }
      });
      state.$get('a.a1').should.equal(2);
    });

    it('should set path value', function() {
      var state = new State({
        a: { a1: 2 }
      });
      state.$set('a.a1', 3);
      state.$get('a.a1').should.equal(3);
    });
  });

  describe('sub/unsub', function() {
    it('should listen basic listener', function() {
      var state = new State({ a: 2 });
      var handler = sinon.spy();
      state.$on('a', handler);
      state.$set('a', 3);
      handler.should.calledOnce;

      state.$set('a', 4);

      handler.should.calledTwice;
    });

    it('should unlisten listener', function() {
      var state = new State({ a: 2 });
      var handler = sinon.spy();
      state.$on('a', handler);
      state.$set('a', 3);
      handler.should.calledOnce;

      state.$off('a', handler);

      state.$set('a', 4);

      handler.should.calledOnce;
    });

    it('should all listener when not specific a listener', function() {
      var state = new State({ a: 2 });
      var handler = sinon.spy();
      var handler2 = sinon.spy();
      state.$on('a', handler);
      state.$on('a', handler2);
      state.$set('a', 3);
      handler.should.calledOnce;
      handler2.should.calledOnce;

      state.$off('a');

      state.$set('a', 4);

      handler.should.calledOnce;
      handler2.should.calledOnce;
    });
  });
});