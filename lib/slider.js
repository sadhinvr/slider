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

var Slider = /*#__PURE__*/function () {
  function Slider(parent, set) {
    var _z$at2, _set$nxt, _set$pre;

    _classCallCheck(this, Slider);

    var z = this;
    z.p = parent; //parent
    //responsive

    set !== null && set !== void 0 && set.res ? z.res = set.res : z.res = {
      all: {
        show: 2,
        to: 1
      }
    };
    !z.res.all && (z.res.all = {
      o: (set === null || set === void 0 ? void 0 : set.show) || 2,
      to: (set === null || set === void 0 ? void 0 : set.to) || 1
    }); //

    z.o = z.res.all.show;
    z.to = z.res.all.to; //slideby

    z.fr();
    z.sp = (set === null || set === void 0 ? void 0 : set.speed) || 500; //speed

    z.at = (set === null || set === void 0 ? void 0 : set.auto) || false;
    z.at && setInterval(function () {
      var _z$at;

      !z.hover && z.fs(((_z$at = z.at) === null || _z$at === void 0 ? void 0 : _z$at.deraction) || 1);
    }, ((_z$at2 = z.at) === null || _z$at2 === void 0 ? void 0 : _z$at2.delay) || 2000);
    z.ss = document.createElement("style");
    document.head.appendChild(z.ss);
    z.ss.sheet.insertRule("\n        .slider-item {\n            min-width: calc((100% / ".concat(z.o, ") - 16px);\n            max-width: calc((100% / ").concat(z.o, ") - 16px);\n        }\n        "));
    z.hanResize();
    z.s = z.p.firstElementChild; //slide

    z.i = z.s.children; //children

    z.t = z.i.length; //total children

    z.cc = z.gcc(); //clonecount

    z.cn = z.t + z.cc * 2; //clonecountnew

    z.x = z.cc; //index

    z.m = Math.max(0, z.cn - Math.ceil(z.o)); //maxindex

    z.a = []; //mainarr

    z.c = 0; //curindex

    z.ins();
    z.fs(0);
    z.ev();

    var btn = function btn() {
      var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      clearTimeout(z.preBtnTimeOut);
      z.hover = true;
      z.preBtnTimeOut = setTimeout(function () {
        return z.hover = false;
      }, z.sp * 2);
      z.fs(s);
    };

    set === null || set === void 0 ? void 0 : (_set$nxt = set.nxt) === null || _set$nxt === void 0 ? void 0 : _set$nxt.addEventListener("click", function () {
      return btn();
    });
    set === null || set === void 0 ? void 0 : (_set$pre = set.pre) === null || _set$pre === void 0 ? void 0 : _set$pre.addEventListener("click", function () {
      return btn(-1);
    });
  } //getitemsmax


  _createClass(Slider, [{
    key: "gm",
    value: function gm() {
      var arr = [];
      this.o < this.t && arr.push(this.o);
      !arr.length && arr.push(0);
      return Math.ceil(Math.max.apply(null, arr));
    } //getCloneCountForLoop

  }, {
    key: "gcc",
    value: function gcc() {
      var itemsMax = this.gm(),
          result = Math.ceil((itemsMax * 5 - this.t) / 2);
      result = Math.max(itemsMax, result);
      return result;
    } //initstucture

  }, {
    key: "ins",
    value: function ins() {
      var z = this;

      if (z.cc) {
        var fragmentBefore = document.createDocumentFragment(),
            fragmentAfter = document.createDocumentFragment();
        z.ta = []; //temp array

        _toConsumableArray(z.i).forEach(function (e, i) {
          e.dataset.id = i;
          z.ta.push(i);
        });

        for (var j = z.cc; j--;) {
          var num = j % z.t,
              cloneFirst = z.i[num].cloneNode(true),
              lastIndex = z.t - 1 - num,
              cloneLast = z.i[lastIndex].cloneNode(true);
          cloneFirst.classList.add("clone");
          fragmentAfter.insertBefore(cloneFirst, fragmentAfter.firstChild);
          cloneLast.classList.add("clone");
          fragmentBefore.appendChild(cloneLast);
        }

        z.s.insertBefore(fragmentBefore, z.s.firstChild);
        z.s.appendChild(fragmentAfter);

        _toConsumableArray(z.i).forEach(function (ele) {
          return z.a.push(ele.dataset.id * 1);
        });

        z.rp();
      }
    } //resetpos

  }, {
    key: "rp",
    value: function rp() {
      this.c = this.cc;
      this.s.style = "transform: translate3d(".concat(-100 / this.o * this.c, "%, 0px, 0px);transition: all ").concat(this.sp / 1000, "s ease 0s");
    } //slidefunction

  }, {
    key: "fs",
    value: function fs() {
      var sign = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      // let r;
      var z = this;
      var temI = z.c + z.to * sign;
      var temI2 = temI + z.to * sign;

      var temRevArr = _toConsumableArray(z.ta).reverse();

      z.playBack = function () {
        var sign = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var pospre = z.a[z.c] - z.to,
            posnxt = z.a[z.c] + z.o + z.to;
        posnxt > z.t ? posnxt = posnxt % z.t : null;
        pospre < 0 ? pospre = temRevArr[-1 * pospre - 1] : null;

        if (sign == -1) {
          for (var i = 0; i < z.a.length; i++) {
            if (i <= z.c) {
              continue;
            }

            if (z.a[i] == z.a[z.c] && z.a[i - z.to] == pospre) {
              z.c = i; // console.log(goto);

              break;
            }
          }
        } else {
          for (var _i = z.a.length; _i > -1; _i--) {
            if (_i >= z.c) {
              continue;
            } // console.log('kdjk')


            if (z.a[_i] == z.a[z.c] && z.a[_i + z.o + z.to] == posnxt) {
              z.c = _i;
              break;
            }
          }
        }

        z.s.style = "transform: translate3d(".concat(-100 / z.o * z.c, "%, 0px, 0px);transition: all 0s ease 0s");
      };

      if (sign) {
        if (temI >= 0 && temI <= z.a.length - z.o) {
          z.c = temI;
          z.s.style = "transform: translate3d(".concat(-100 / z.o * z.c, "%, 0px, 0px);transition: all ").concat(z.sp / 1000, "s ease 0s");
        } // console.log(z.c);


        if (temI2 < 0 || temI2 > z.a.length - z.o) {
          setTimeout(function () {
            return z.playBack(sign);
          }, z.sp);
        }
      }
    } //reponsive function

  }, {
    key: "fr",
    value: function fr() {
      var z = this;
      var temTimer,
          keys = Object.keys(z.res).filter(function (k) {
        return k * 1;
      }).map(function (k) {
        return k * 1;
      }).sort(function (a, b) {
        return a - b;
      });

      z.hanResize = function () {
        var x = [].concat(_toConsumableArray(keys), [window.innerWidth]).sort(function (a, b) {
          return a - b;
        }).findIndex(function (a) {
          return a == window.innerWidth;
        }) - 1;

        if (x != -1) {
          var bp = z.res[keys[x]];
          z.o = (bp === null || bp === void 0 ? void 0 : bp.o) || z.o;
          z.to = (bp === null || bp === void 0 ? void 0 : bp.to) || z.to;
        } else {
          z.o = z.res.all.o;
          z.to = z.res.all.to;
        }

        var tempStyle = "calc((100% / ".concat(z.o, ") - 16px)"),
            style = z.ss.sheet.cssRules[0].style;
        style.maxWidth = tempStyle;
        style.minWidth = tempStyle;
      };

      window.addEventListener("resize", function (e) {
        temTimer && clearTimeout(temTimer);
        temTimer = setTimeout(function () {
          z.hanResize();
          z.rp();
        }, 200);
      });
    } //set events function

  }, {
    key: "ev",
    value: function ev() {
      var z = this;
      z.p.addEventListener("mouseover", function () {
        z.hover = true;
      });

      var startSwiping = function startSwiping(e) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        z.hover = true;

        var react = z.p.getBoundingClientRect(),
            temX = (e.clientX || e.touches[0].clientX) - react.x,
            temCurInd = z.c,
            calPos = function calPos(e) {
          z.temXpos = -100 / z.o * temCurInd - (temX - (e.clientX || e.touches[0].clientX) - react.x) / react.width * 100;
        }; // console.log('touchstart');


        z.touchMove = function (e) {
          calPos(e);
          z.c = Math.round(Math.abs(z.temXpos / (100 / z.o)));

          if (z.temXpos <= (z.a.length - z.o) * (-100 / z.o) || z.temXpos >= 0) {
            // temCurInd=z.c;
            // console.log(z.c)
            temX = (e.clientX || e.touches[0].clientX) - react.x;
            z.playBack(z.temXpos >= 0 ? -1 : 1);
            temCurInd = z.c;
            calPos(e); // z.temXpos = (-100 / z.o) * z.c;
          } // console.log(z.temXpos)


          z.s.style = "transform: translate3d(".concat(z.temXpos, "%, 0px, 0px);transition:0s");
        };

        window.addEventListener("touchmove", z.touchMove);
        window.addEventListener("mousemove", z.touchMove);
      };

      var stopSwiping = function stopSwiping(e) {
        window.removeEventListener("touchmove", z.touchMove);
        window.removeEventListener("mousemove", z.touchMove);
        setTimeout(function () {
          return z.hover = false;
        }, z.sp * 2);

        if (z.temXpos) {
          z.c = Math.round(Math.abs(z.temXpos / (100 / z.o)));
          z.s.style = "transform: translate3d(".concat(-100 / z.o * z.c, "%, 0px, 0px);transition: all ").concat(z.sp / 1000 / 1.5, "s ease 0s");
        }
      };

      z.p.addEventListener("touchstart", startSwiping);
      z.s.addEventListener("mousedown", startSwiping);
      z.p.addEventListener("touchend", stopSwiping);
      z.p.addEventListener("mouseup", stopSwiping);
      z.p.addEventListener("mouseleave", function () {
        z.hover = false;
      });
    }
  }]);

  return Slider;
}();