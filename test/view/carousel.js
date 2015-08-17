var factory = require('../../src/view/factory');
var View = require('../../src/view/view');
var compile = require('wind-compiler').compile;

var Carousel = function() {
  View.apply(this, arguments);
  this.state.setActiveSlide = function() {
  };
};

Carousel.prototype = new View();
Carousel.prototype.constructor = Carousel;

Carousel.prototype.template = compile('<div class="carousel-wrapper"><ul class="carousel-list"><yield /></ul><ol class="carousel-pager"><li class="page-number" repeat="slide in content" [class]="active: slide.active" (click)="setActiveSlide($index)">{{$index + 1}}</li></ol></div>');

factory.register('r-carousel', Carousel);

var Slide = function() {
  View.apply(this, arguments);
};

Slide.prototype = new View();
Slide.prototype.constructor = Slide;

Slide.prototype.template = compile('<li class="carousel-block"><yield /></li>');

factory.register('r-slide', Slide);