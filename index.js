(function(){

  var ENV = '';

  var defaultOptions = {
    source: 'CDN',
    firebaseURL: 'https://cdn.firebase.com/js/client/2.4.2/firebase.js',
    firebaseRoot: 'https://eleme-flowchart.firebaseio.com/'
  };

  function loadScript(src, fn) {
    var script = document.createElement('script');
    script.src = src;
    script.onload = fn;
    document.body.appendChild(script);
  }

  function applyStyle (el, style) {
    Object.assign(el.style, style);
  }

  function renderEmpty (el) {
    el.innerHTML = '无数据';
  }

  function renderBlock (block, style, grid) {
    var el = document.createElement('div');
    style.position = 'absolute';
    style.left = block.x * grid + 'px';
    style.top = block.y * grid + 'px';
    style.zIndex = 99;
    style.borderWidth = '1px';
    style.borderStyle = 'solid';
    applyStyle(el, style);
    el.setAttribute('data-id', block.id);
    return el;
  }

  function renderLink (ctx, link, options) {
    ctx.beginPath();
    ctx.moveTo(link.x1, link.y1);
    ctx.lineTo(link.x1, link.y2 - options.size);
    ctx.moveTo(link.x1, link.y2 - options.size);
    ctx.lineTo(link.x2, link.y2 - options.size);
    ctx.moveTo(link.x2, link.y2 - options.size);
    ctx.lineTo(link.x2, link.y2);
    ctx.strokeStyle = options.color;
    ctx.lineWidth = options.width;
    ctx.stroke()
  }

  var Render = function () {};

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
  };

  Render.prototype.clean = function () {
    this.el.innerHTML = '加载中...';
    this.el.removeAttribute('style');
    applyStyle(this.el, {
      padding: '15px',
      textAlign: 'center'
    });
  };

  Render.prototype.loadData = function () {
    var self = this;

    var loadDataFromFirebase = function () {
      if (!window.Firebase) {
        window.Firebase = require('firebase');
      }
      new window.Firebase(self.options.firebaseRoot).child('projects/' + self.options.name).once('value', function (snapshot) {
        self.render(snapshot.val());
      });
    };

    // load from firebase
    if (this.options.source === 'firebase') {
      // firebase already exist
      if (typeof Firebase === 'function' || ENV === 'CMD') {
        loadDataFromFirebase();
      } else {
        loadScript(this.options.firebaseURL, loadDataFromFirebase);
      }
    }

    // load from CDN
    if (this.options.source === 'CDN') {
      // todo
    }
  };

  Render.prototype.render = function (model) {
    if (model && model.data && model.data.data) {
      this.el.innerHTML = '';
      this.data = model.data.data;
      this.settings = model.data.settings;
      this.renderBackground();
      this.renderBlocks();
    } else {
      renderEmpty(this.el);
    }
  };

  Render.prototype.renderBackground = function () {
    this.settings.background.width += 'px';
    this.settings.background.height += 'px';
    this.settings.background.position = 'relative';
    this.settings.background.padding = '';
    applyStyle(this.el, this.settings.background);
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', this.settings.background.width);
    canvas.setAttribute('height', this.settings.background.height);
    applyStyle(canvas, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: this.settings.background.width,
      height: this.settings.background.height,
      zIndex: 9
    });
    this.el.appendChild(canvas);
    this.renderCanvas(canvas);
  };

  Render.prototype.renderCanvas = function (canvas) {
    var ctx = canvas.getContext('2d');
    var self = this;
    if (!this.data.lines) {
      return;
    }
    this.data.lines.forEach(function (line) {
      renderLink(ctx, line, {
        size: self.settings.grid.size,
        color: self.settings.line.color || '#666',
        width: self.settings.line.width || 1
      })
    })
  };

  Render.prototype.renderBlocks = function () {
    var blockStyle = this.settings.block || {};
    blockStyle.width += 'px';
    blockStyle.height += 'px';
    var gridSize = this.settings.grid.size;
    this.data.blocks = this.data.blocks || [];
    var blocks = document.createDocumentFragment();
    this.data.blocks.forEach(function (block) {
      blocks.appendChild(renderBlock(block, blockStyle, gridSize));
    });
    this.el.appendChild(blocks);
  };

  if (typeof define === 'function' && define.amd) {
  	define( function() { return Render; } );
  }
  else if (typeof module === 'object' && module.exports) {
  	module.exports = Render;
    ENV = 'CMD';
  }
  else {
  	window.Render = Render;
  }
})();
