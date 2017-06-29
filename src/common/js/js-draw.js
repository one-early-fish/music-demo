var myDraw = (function () {
  // 拖拽构造函数
  function ElementDraw(opt) {
    if (!opt.el) {
      throw new Error('参数未传递');
    }
    this.el = opt.el;
    this.area = opt.area || document.documentElement;
    if (opt.drawX === false) {
      this.drawX = false;
    } else {
      this.drawX = true;
    }
    if (opt.drawY === false) {
      this.drawY = false;
    } else {
      this.drawY = true;
    }
    this.callback_move = opt.callback_move;
    this.callback_up = opt.callback_up;
    // 元素的基本信息
    this._elInfo = {
      width: this.el.clientWidth,
      height: this.el.clientHeight,
      targetX: this.el.offsetLeft - this.el.parentNode.offsetWidth,
      targetY: this.el.offsetTop - this.el.parentNode.offsetHeight
    };
    // 边界区域的信息
    this._areaInfo = {
      width: this.area.clientWidth,
      height: this.area.clientHeight
    };
    // 鼠标方面的信息
    this.disX = 0;
    this.disY = 0;
    // 操作方面信息
    this.iPosX = 0;
    this.iPosY = 0;
  }

  ElementDraw.prototype.initial = function () {
    var self = this;
    this.el.onmousedown = function () {
      self.down();
    };
  };
  ElementDraw.prototype.down = function (ev) {
    var self = this;
    ev = window.event || ev;
    if (this.drawX) {
      this.disX = ev.clientX - this.el.offsetLeft;
    }
    if (this.drawY) {
      this.disY = ev.clientY - this.el.offsetTop;
    }
    document.onmousemove = function () {
      self.move();
    };
    document.onmouseup = function () {
      self.up();
    };
  };
  ElementDraw.prototype.move = function (ev) {
    ev = window.event || ev;
    if (this.drawX) {
      this.iPosX = ev.clientX - this.disX;
      var maxX = this._areaInfo.width - this._elInfo.width - this._elInfo.targetX;
      if (this.iPosX >= maxX) {
        this.iPosX = maxX;
      } else if (this.iPosX <= this._elInfo.targetX) {
        this.iPosX = this._elInfo.targetX;
      }
    }
    if (this.drawY) {
      this.iPosY = ev.clientY - this.disY;
      var maxY = this._areaInfo.height - this._elInfo.height - this._elInfo.targetY;
      if (this.iPosY >= maxY) {
        this.iPosY = maxY;
      } else if (this.iPosY <= this._elInfo.targetY) {
        this.iPosY = this._elInfo.targetY;
      }
    }
    // 回调函数
    this.callback_move && this.callback_move({
      start: {
        X: this._elInfo.targetX,
        Y: this._elInfo.targetY
      },
      total: {
        X: maxX - this._elInfo.targetX,
        Y: maxY - this._elInfo.targetY
      },
      move: {
        X: this.iPosX,
        Y: this.iPosY
      }
    });
  };
  ElementDraw.prototype.up = function () {
    document.onmousemove = null;
    document.onmouseup = null;
    this.callback_up && this.callback_up();
  };
  // 初始化
  function init(opt) {
    return new ElementDraw(opt).initial();
  }

  return {
    init: init
  };
})();

module.exports = myDraw;
