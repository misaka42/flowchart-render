(function(){

  var defaultOptions = {
    source: 'CDN'
  };

  var Render = function (el) {};

  Render.prototype.init = function (el, options) {
    if (!el) {
      console.error('first argument should be an exist element');
    }
    this.el = el;
    this.options = Object.assign(defaultOptions, options);
    this.refresh();
  };

  Render.prototype.refresh = function () {
    this.clean();
    this.loadData();
  }

  Render.prototype.clean = function () {
    this.el.innerHtml = '';
  }

  Render.prototype.loadData = function () {
    console.log('test')
  }

  if (typeof define === 'function' && define.amd) {
  	define( function() { return ModuleA; } );
  }
  else if (typeof module === 'object' && module.exports) {
  	module.exports = ModuleA;
  }
  else {
  	window.Render = Render;
  }
})();
