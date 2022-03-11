"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function slider(parent, set) {
  var responsive = _objectSpread(_objectSpread({}, (set === null || set === void 0 ? void 0 : set.responsive) || {}), {}, {
    all: {
      show: (set === null || set === void 0 ? void 0 : set.show) || 2,
      to: (set === null || set === void 0 ? void 0 : set.to) || 1,
      gutter: (set === null || set === void 0 ? void 0 : set.gutter) || 16
    }
  }),
      keys = Object.keys(responsive).filter(function (k) {
    return k * 1;
  }).map(function (k) {
    return k * 1;
  }).sort(function (a, b) {
    return a - b;
  }),
      show = Math.max.apply(Math, _toConsumableArray(Object.values(responsive).map(function (v) {
    return v.show ? v.show : 0;
  }))),
      to = responsive.all.to,
      gutter = responsive.all.gutter,
      speed = (set === null || set === void 0 ? void 0 : set.speed) || 500,
      auto = set === null || set === void 0 ? void 0 : set.auto,
      styleSheet = document.createElement("style"),
      //append it to head & insert rule
  slide = parent.firstElementChild,
      slideItems = slide.children,
      total = slideItems.length,
      cloneCount = Math.max(show, Math.ceil((show * 5 - total) / 2)),
      temCloneCount = total + cloneCount * 2,
      //index = cloneCount,
  //maxIndex = Math.max(0, temCloneCount - show), //
  mainArr = [],
      tempArr = [],
      curIndex = 0,
      playBack,
      hover,
      startedSwiping,
      stopSwipngSetTimeout,
      temXpos,
      touchMoveFun,
      fragmentBefore = document.createDocumentFragment(),
      fragmentAfter = fragmentBefore.cloneNode(true),
      temTimer,
      clickTimeoutId,
      offset;

  document.head.appendChild(styleSheet);
  styleSheet.sheet.insertRule('.s-i{}');

  if (show >= total) {
    return;
  } //init


  if (cloneCount) {
    _toConsumableArray(slideItems).forEach(function (e, i) {
      e.dataset.id = i;
      e.classList.add("s-i");
      tempArr.push(i);
    });

    for (var j = cloneCount; j--;) {
      var num = j % total,
          cloneFirst = slideItems[num].cloneNode(true),
          lastIndex = total - 1 - num,
          cloneLast = slideItems[lastIndex].cloneNode(true);
      cloneFirst.classList.add("clone");
      fragmentAfter.insertBefore(cloneFirst, fragmentAfter.firstChild);
      cloneLast.classList.add("clone");
      fragmentBefore.appendChild(cloneLast);
    }

    slide.insertBefore(fragmentBefore, slide.firstChild);
    slide.appendChild(fragmentAfter);

    _toConsumableArray(slideItems).forEach(function (ele) {
      return mainArr.push(ele.dataset.id * 1);
    });

    resetpos();
  }

  var hanResize = function hanResize() {
    var x = [].concat(_toConsumableArray(keys), [window.innerWidth]).sort(function (a, b) {
      return a - b;
    }).findIndex(function (a) {
      return a == window.innerWidth;
    }) - 1;

    if (x != -1) {
      var bp = responsive[keys[x]];
      show = (bp === null || bp === void 0 ? void 0 : bp.show) || show;
      to = (bp === null || bp === void 0 ? void 0 : bp.to) || to;
      gutter = (bp === null || bp === void 0 ? void 0 : bp.gutter) || gutter;
    } else {
      show = responsive.all.show;
      to = responsive.all.to;
      gutter = responsive.all.gutter;
    }

    offset = gutter * (show - 1) / show; // slideItems[0].style.marginLeft = `${gutter/2}px`

    var tempStyle = "calc((100% / ".concat(show, ") - ").concat(offset, "px)"),
        style = styleSheet.sheet.cssRules[0].style;
    style.maxWidth = tempStyle;
    style.minWidth = tempStyle;
  };

  hanResize();
  fs();
  parent.addEventListener("mouseover", function () {
    hover = true;
  });

  var startSwiping = function startSwiping(e) {
    startedSwiping = true;
    stopSwipngSetTimeout && clearTimeout(stopSwipngSetTimeout);
    e.cancelable && e.preventDefault();
    e.stopPropagation();
    hover = true;

    if (e.clientX || e.touches) {
      var react = parent.getBoundingClientRect(),
          temX = (e.clientX || e.touches[0].clientX) - react.x,
          temCurInd = curIndex,
          calPos = function calPos(e) {
        temXpos = -100 / show * temCurInd - 100 / window.innerWidth * curIndex * (gutter / show) - (temX - (e.clientX || (e === null || e === void 0 ? void 0 : e.touches[0].clientX)) - react.x) / react.width * 100;
      }; // console.log('touchstart');
      //touch move function


      touchMoveFun = function touchMoveFun(e) {
        calPos(e);
        curIndex = Math.round(Math.abs(temXpos / (100 / show)));

        if (temXpos <= (mainArr.length - show) * (-100 / show) || temXpos >= 0) {
          // temCurInd=curIndex;
          // console.log(curIndex)
          temX = (e.clientX || (e === null || e === void 0 ? void 0 : e.touches[0].clientX)) - react.x;
          playBack(temXpos >= 0 ? -1 : 1);
          temCurInd = curIndex;
          calPos(e); // temXpos = (-100 / show) * curIndex;
          // console.log((-100 / show) * curIndex);
        } // console.log(temXpos)


        slide.style = "transform: translate3d(".concat(temXpos, "%, 0px, 0px);transition:0s");
      };

      window.addEventListener("touchmove", touchMoveFun);
      window.addEventListener("mousemove", touchMoveFun);
    }
  };

  var stopSwiping = function stopSwiping() {
    if (startedSwiping) {
      window.removeEventListener("touchmove", touchMoveFun);
      window.removeEventListener("mousemove", touchMoveFun);
      stopSwipngSetTimeout = setTimeout(function () {
        return hover = false;
      }, speed * 2);

      if (temXpos) {
        curIndex = Math.round(Math.abs(temXpos / (100 / show)));
        slideStyle(speed / 1000 / 1.5);
        temXpos = 0;
      }

      startedSwiping = false;
    }
  };

  parent.addEventListener("touchstart", startSwiping);
  parent.addEventListener("mousedown", startSwiping);
  parent.addEventListener("touchend", stopSwiping);
  window.addEventListener("mouseup", stopSwiping);
  parent.addEventListener("mouseleave", function () {
    hover = false;
  });
  window.addEventListener("resize", function () {
    temTimer && clearTimeout(temTimer);
    temTimer = setTimeout(function () {
      hanResize();
      resetpos();
    }, 200);
  });
  auto && setInterval(function () {
    !hover && fs((auto === null || auto === void 0 ? void 0 : auto.deraction) || 1);
  }, (auto === null || auto === void 0 ? void 0 : auto.delay) || 2000); //button addeventlistener
  //resetpos

  function resetpos() {
    curIndex = cloneCount;
    slideStyle();
  } //slide function


  function fs() {
    var sign = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    // let r;
    var temI = curIndex + to * sign;
    var temI2 = temI + to * sign;
    var temRevArr = [].concat(tempArr).reverse();

    playBack = function playBack() {
      var sign = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var pospre = mainArr[curIndex] - to,
          posnxt = mainArr[curIndex] + show + to;
      posnxt > total ? posnxt = posnxt % total : null;
      pospre < 0 ? pospre = temRevArr[-1 * pospre - 1] : null;

      if (sign == -1) {
        for (var i = 0; i < mainArr.length; i++) {
          if (i <= curIndex) {
            continue;
          }

          if (mainArr[i] == mainArr[curIndex] && mainArr[i - to] == pospre) {
            curIndex = i; // console.log(goto);

            break;
          }
        }
      } else {
        for (var _i = mainArr.length; _i > -1; _i--) {
          if (_i >= curIndex) {
            continue;
          } // console.log('kdjk')


          if (mainArr[_i] == mainArr[curIndex] && mainArr[_i + show + to] == posnxt) {
            curIndex = _i;
            break;
          }
        }
      }

      slideStyle(false);
    };

    if (sign) {
      if (temI >= 0 && temI <= mainArr.length - show) {
        curIndex = temI;
        slideStyle();
      } // console.log(curIndex);


      if (temI2 < 0 || temI2 > mainArr.length - show) {
        setTimeout(function () {
          return playBack(sign);
        }, speed);
      }
    }
  }

  function slideStyle() {
    var transition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : speed / 1000;
    // console.log( ((-100 / show) * curIndex)-(100/window.innerWidth)*curIndex*(gutter/show))
    slide.style = "transform: translate3d(".concat(-100 / show * curIndex - 100 / window.innerWidth * curIndex * (gutter / show), "%, 0px, 0px);").concat(transition ? "transition: all ".concat(transition, "s ease 0s") : "");
  }

  var click = function click(e) {
    var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    e.addEventListener("click", function () {
      clearTimeout(clickTimeoutId);
      hover = true;
      clickTimeoutId = setTimeout(function () {
        return hover = false;
      }, speed * 2);
      fs(s);
    });
  };

  return {
    click: click
  };
}