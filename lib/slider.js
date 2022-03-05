"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var $ = document.querySelector.bind(document);

var Carousel = /*#__PURE__*/function () {
  function Carousel(parent, set) {
    var _this = this,
        _set$nxt,
        _set$pre;

    _classCallCheck(this, Carousel);

    this.parent = parent;
    set !== null && set !== void 0 && set.responsive ? this.responsive = set.responsive : this.responsive = {
      "default": {
        show: 2,
        slideby: 1
      }
    };
    !this.responsive["default"] && (this.responsive["default"] = {
      show: (set === null || set === void 0 ? void 0 : set.show) || 2,
      slideby: (set === null || set === void 0 ? void 0 : set.slideby) || 1
    });
    this.show = this.responsive["default"].show;
    this.slideby = this.responsive["default"].slideby;
    this.response();
    this.speed = (set === null || set === void 0 ? void 0 : set.speed) || 500;
    this.auto = (set === null || set === void 0 ? void 0 : set.auto) || false;
    this.auto && this.autoPlay();
    this.styleSheet = document.createElement("style");
    document.head.appendChild(this.styleSheet);
    this.styleSheet.sheet.insertRule("\n        .slider-item {\n            min-width: calc((100% / ".concat(this.show, ") - 16px);\n            max-width: calc((100% / ").concat(this.show, ") - 16px);\n        }\n        "));
    this.hanResize();
    this.slide = this.parent.firstElementChild;
    this.slideItems = this.slide.children;
    this.total = this.slideItems.length;
    this.cloneCount = this.getCloneCountForLoop();
    this.slideCountNew = this.total + this.cloneCount * 2;
    this.index = this.cloneCount;
    this.indexMax = Math.max(0, this.slideCountNew - Math.ceil(this.show));
    this.mainArr = [];
    this.curIndex = 0;
    this.initStructure();
    this.slideFun(0);
    this.events();

    var btn = function btn() {
      var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      clearTimeout(_this.preBtnTimeOut);
      _this.hover = true;
      _this.preBtnTimeOut = setTimeout(function () {
        return _this.hover = false;
      }, _this.speed * 2);

      _this.slideFun(s);
    };

    set === null || set === void 0 ? void 0 : (_set$nxt = set.nxt) === null || _set$nxt === void 0 ? void 0 : _set$nxt.addEventListener("click", function () {
      return btn();
    });
    set === null || set === void 0 ? void 0 : (_set$pre = set.pre) === null || _set$pre === void 0 ? void 0 : _set$pre.addEventListener("click", function () {
      return btn(-1);
    });
  }

  _createClass(Carousel, [{
    key: "autoPlay",
    value: function autoPlay() {
      var _this2 = this,
          _this$auto;

      setInterval(function () {
        var _this2$auto;

        !_this2.hover && _this2.slideFun(((_this2$auto = _this2.auto) === null || _this2$auto === void 0 ? void 0 : _this2$auto.deraction) || 1);
      }, ((_this$auto = this.auto) === null || _this$auto === void 0 ? void 0 : _this$auto.delay) || 2000);
    }
  }, {
    key: "getItemsMax",
    value: function getItemsMax() {
      var arr = [];

      if (this.show < this.total) {
        arr.push(this.show);
      }

      if (!arr.length) {
        arr.push(0);
      }

      return Math.ceil(Math.max.apply(null, arr));
    }
  }, {
    key: "getCloneCountForLoop",
    value: function getCloneCountForLoop() {
      var itemsMax = this.getItemsMax(),
          result = Math.ceil((itemsMax * 5 - this.total) / 2);
      result = Math.max(itemsMax, result);
      return result;
    }
  }, {
    key: "initStructure",
    value: function initStructure() {
      var _this3 = this;

      if (this.cloneCount) {
        var fragmentBefore = document.createDocumentFragment(),
            fragmentAfter = document.createDocumentFragment();
        this.tempArr = [];

        _toConsumableArray(this.slideItems).forEach(function (ele, i) {
          ele.dataset.id = i;

          _this3.tempArr.push(i);
        });

        for (var j = this.cloneCount; j--;) {
          var num = j % this.total,
              cloneFirst = this.slideItems[num].cloneNode(true),
              lastIndex = this.total - 1 - num,
              cloneLast = this.slideItems[lastIndex].cloneNode(true);
          cloneFirst.classList.add("clone");
          fragmentAfter.insertBefore(cloneFirst, fragmentAfter.firstChild);
          cloneLast.classList.add("clone");
          fragmentBefore.appendChild(cloneLast);
        }

        this.slide.insertBefore(fragmentBefore, this.slide.firstChild);
        this.slide.appendChild(fragmentAfter);

        _toConsumableArray(this.slideItems).forEach(function (ele) {
          return _this3.mainArr.push(ele.dataset.id * 1);
        });

        this.resetPos();
      }
    }
  }, {
    key: "resetPos",
    value: function resetPos() {
      this.curIndex = this.cloneCount;
      this.slide.style = "transform: translate3d(".concat(-100 / this.show * this.curIndex, "%, 0px, 0px);transition: all ").concat(this.speed / 1000, "s ease 0s");
    }
  }, {
    key: "slideFun",
    value: function slideFun() {
      var _this4 = this;

      var sign = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      // let r;
      var temI = this.curIndex + this.slideby * sign;
      var temI2 = temI + this.slideby * sign;

      var temRevArr = _toConsumableArray(this.tempArr).reverse();

      this.playBack = function () {
        var sign = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        console.log(_this4.curIndex);
        var pospre = _this4.mainArr[_this4.curIndex] - _this4.slideby,
            posnxt = _this4.mainArr[_this4.curIndex] + _this4.show + _this4.slideby;
        posnxt > _this4.total ? posnxt = posnxt % _this4.total : null;
        pospre < 0 ? pospre = temRevArr[-1 * pospre - 1] : null;

        if (sign == -1) {
          for (var i = 0; i < _this4.mainArr.length; i++) {
            if (i <= _this4.curIndex) {
              continue;
            }

            if (_this4.mainArr[i] == _this4.mainArr[_this4.curIndex] && _this4.mainArr[i - _this4.slideby] == pospre) {
              _this4.curIndex = i; // console.log(goto);

              break;
            }
          }
        } else {
          for (var _i = _this4.mainArr.length; _i > -1; _i--) {
            if (_i >= _this4.curIndex) {
              continue;
            } // console.log('kdjk')


            if (_this4.mainArr[_i] == _this4.mainArr[_this4.curIndex] && _this4.mainArr[_i + _this4.show + _this4.slideby] == posnxt) {
              _this4.curIndex = _i;
              break;
            }
          }
        }

        _this4.slide.style = "transform: translate3d(".concat(-100 / _this4.show * _this4.curIndex, "%, 0px, 0px);transition: all 0s ease 0s");
      };

      if (sign) {
        if (temI >= 0 && temI <= this.mainArr.length - this.show) {
          this.curIndex = temI;
          this.slide.style = "transform: translate3d(".concat(-100 / this.show * this.curIndex, "%, 0px, 0px);transition: all ").concat(this.speed / 1000, "s ease 0s");
        } // console.log(this.curIndex);


        if (temI2 < 0 || temI2 > this.mainArr.length - this.show) {
          setTimeout(function () {
            return _this4.playBack(sign);
          }, this.speed);
        }
      }

      console.log(this.curIndex);
    }
  }, {
    key: "response",
    value: function response() {
      var _this5 = this;

      var temTimer,
          keys = Object.keys(this.responsive).filter(function (k) {
        return k * 1;
      }).map(function (k) {
        return k * 1;
      }).sort(function (a, b) {
        return a - b;
      });

      this.hanResize = function () {
        var index = [].concat(_toConsumableArray(keys), [window.innerWidth]).sort(function (a, b) {
          return a - b;
        }).findIndex(function (a) {
          return a == window.innerWidth;
        }) - 1;

        if (index != -1) {
          var bp = _this5.responsive[keys[index]];
          _this5.show = (bp === null || bp === void 0 ? void 0 : bp.show) || _this5.show;
          _this5.slideby = (bp === null || bp === void 0 ? void 0 : bp.slideby) || _this5.slideby;
        } else {
          _this5.show = _this5.responsive["default"].show;
          _this5.slideby = _this5.responsive["default"].slideby;
        }

        var tempStyle = "calc((100% / ".concat(_this5.show, ") - 16px)"),
            style = _this5.styleSheet.sheet.cssRules[0].style;
        style.maxWidth = tempStyle;
        style.minWidth = tempStyle;
      };

      window.addEventListener("resize", function (e) {
        temTimer && clearTimeout(temTimer);
        temTimer = setTimeout(function () {
          _this5.hanResize();

          _this5.resetPos();
        }, 200);
      });
    }
  }, {
    key: "events",
    value: function events() {
      var _this6 = this;

      this.parent.addEventListener("mouseover", function () {
        _this6.hover = true;
      });

      var startSwiping = function startSwiping(e) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        _this6.hover = true;

        var react = _this6.parent.getBoundingClientRect(),
            temX = (e.clientX || e.touches[0].clientX) - react.x,
            temCurInd = _this6.curIndex,
            calPos = function calPos(e) {
          _this6.temXpos = -100 / _this6.show * temCurInd - (temX - (e.clientX || e.touches[0].clientX) - react.x) / react.width * 100;
        }; // console.log('touchstart');


        _this6.touchMove = function (e) {
          calPos(e);
          _this6.curIndex = Math.round(Math.abs(_this6.temXpos / (100 / _this6.show)));

          if (_this6.temXpos <= (_this6.mainArr.length - _this6.show) * (-100 / _this6.show) || _this6.temXpos >= 0) {
            // temCurInd=this.curIndex;
            // console.log(this.curIndex)
            temX = (e.clientX || e.touches[0].clientX) - react.x;

            _this6.playBack(_this6.temXpos >= 0 ? -1 : 1);

            temCurInd = _this6.curIndex;
            calPos(e); // this.temXpos = (-100 / this.show) * this.curIndex;

            console.log(-100 / _this6.show * _this6.curIndex);
          } // console.log(this.temXpos)


          _this6.slide.style = "transform: translate3d(".concat(_this6.temXpos, "%, 0px, 0px);transition:0s");
        };

        window.addEventListener("touchmove", _this6.touchMove);
        window.addEventListener("mousemove", _this6.touchMove);
      };

      var stopSwiping = function stopSwiping(e) {
        window.removeEventListener("touchmove", _this6.touchMove);
        window.removeEventListener("mousemove", _this6.touchMove);
        setTimeout(function () {
          return _this6.hover = false;
        }, _this6.speed * 2);

        if (_this6.temXpos) {
          _this6.curIndex = Math.round(Math.abs(_this6.temXpos / (100 / _this6.show)));
          _this6.slide.style = "transform: translate3d(".concat(-100 / _this6.show * _this6.curIndex, "%, 0px, 0px);transition: all ").concat(_this6.speed / 1000 / 1.5, "s ease 0s");
        }
      };

      this.parent.addEventListener("touchstart", startSwiping);
      this.slide.addEventListener("mousedown", startSwiping);
      this.parent.addEventListener("touchend", stopSwiping);
      this.parent.addEventListener("mouseup", stopSwiping);
      this.parent.addEventListener("mouseleave", function () {
        _this6.hover = false;
      });
    }
  }]);

  return Carousel;
}();

var a = new Carousel($(".carousel"), {
  show: 3,
  responsive: {
    900: {
      show: 4,
      slideby: 3
    }
  },
  pre: $("#pre"),
  nxt: $("#nxt"),
  auto: true
});