var util = require('../src/util');
var insertNode = util.insertNode;

describe('util unit test', function() {

  var parentNode = document.createElement('div');

  beforeEach(function() {
    parentNode.innerHTML = '<span></span><div></div>';
  });

  describe('insertNode unit test', function() {
    it('should insert node without insertMode', function() {
      var node = document.createElement('ul');
      insertNode(node, parentNode);
      parentNode.lastChild.tagName.should.equal('UL');
    });

    it('should insert node with begin insertMode', function() {
      var node = document.createElement('ul');
      insertNode(node, parentNode, 'begin');
      parentNode.firstChild.tagName.should.equal('UL');
    });

    it('should insert node with end insertMode', function() {
      var node = document.createElement('ul');
      insertNode(node, parentNode, 'end');
      parentNode.lastChild.tagName.should.equal('UL');
    });

    it('should insert node with after insertMode', function() {
      var node = document.createElement('ul');
      insertNode(node, parentNode, 'after', parentNode.querySelector('span'));
      parentNode.children[1].tagName.should.equal('UL');
    });

    it('should insert node with before insertMode', function() {
      var node = document.createElement('ul');
      insertNode(node, parentNode, 'before', parentNode.querySelector('div'));
      parentNode.children[1].tagName.should.equal('UL');
    });

    it('should throw error if no refNode when insertMode is before or after', function() {
      (function(){
        var node = document.createElement('ul');
        insertNode(node, parentNode, 'before');
      }).should.throw();

      (function() {
        var node = document.createElement('ul');
        insertNode(node, parentNode, 'after');
      }).should.throw();
    });
  });

});