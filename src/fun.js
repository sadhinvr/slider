function slider(parent, set) {
    let responsive = {
            ...(set?.responsive || {}),
            all: { show: set?.show || 2, to: set?.to || 1 ,gutter: set?.gutter || 16},
        },
        keys = Object.keys(responsive)
            .filter((k) => k * 1)
            .map((k) => k * 1)
            .sort((a, b) => a - b),
        show = Math.max(...Object.values(responsive).map(v=>v.show?v.show:0)),
        to = responsive.all.to,
        gutter = responsive.all.gutter,
        speed = set?.speed || 500,
        auto = set?.auto,
        styleSheet = document.createElement("style"), //append it to head & insert rule
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
        clickTimeoutId;

    document.head.appendChild(styleSheet);
    styleSheet.sheet.insertRule('.s-i{}');
    if(show >= total){
        console.warn('Your showing items should be less then total item')
        return;
    }
    //init
    if (cloneCount) {
        [...slideItems].forEach((e, i) => {
            e.dataset.id = i;
            e.classList.add("s-i");
            tempArr.push(i);
        });

        for (let j = cloneCount; j--; ) {
            let num = j % total,
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

        [...slideItems].forEach((ele) => mainArr.push(ele.dataset.id * 1));

        resetpos();
    }

    const hanResize = () => {
        const x =
            [...keys, window.innerWidth]
                .sort((a, b) => a - b)
                .findIndex((a) => a == window.innerWidth) - 1;
        if (x != -1) {
            const bp = responsive[keys[x]];
            show = bp?.show || show;
            to = bp?.to || to;
            gutter = bp?.gutter || gutter;
        } else {
            show = responsive.all.show;
            to = responsive.all.to;
            gutter = responsive.all.gutter;
        }

        slideItems[0].style.marginLeft = `${gutter/2}`
        let tempStyle = `calc((100% / ${show}) - ${gutter}px)`,
            style = styleSheet.sheet.cssRules[0].style;
        style.maxWidth = tempStyle;
        style.minWidth = tempStyle;
    };

    hanResize();
    fs();

    parent.addEventListener("mouseover", () => {
        hover = true;
    });

    const startSwiping = (e) => {
        startedSwiping = true;
        stopSwipngSetTimeout && clearTimeout(stopSwipngSetTimeout);
        e.cancelable && e.preventDefault();
        e.stopPropagation();
        hover = true;
        if (e.clientX || e.touches) {
            let react = parent.getBoundingClientRect(),
                temX = (e.clientX || e.touches[0].clientX) - react.x,
                temCurInd = curIndex,
                calPos = (e) => {
                    temXpos =
                        (-100 / show) * temCurInd -
                        ((temX -
                            (e.clientX || e?.touches[0].clientX) -
                            react.x) /
                            react.width) *
                            100;
                };
            // console.log('touchstart');

            //touch move function
            touchMoveFun = (e) => {
                calPos(e);
                curIndex = Math.round(Math.abs(temXpos / (100 / show)));

                if (
                    temXpos <= (mainArr.length - show) * (-100 / show) ||
                    temXpos >= 0
                ) {
                    // temCurInd=curIndex;
                    // console.log(curIndex)
                    temX = (e.clientX || e?.touches[0].clientX) - react.x;
                    playBack(temXpos >= 0 ? -1 : 1);
                    temCurInd = curIndex;
                    calPos(e);

                    // temXpos = (-100 / show) * curIndex;
                    // console.log((-100 / show) * curIndex);
                }

                // console.log(temXpos)
                slide.style = `transform: translate3d(${temXpos}%, 0px, 0px);transition:0s`;
            };
            window.addEventListener("touchmove", touchMoveFun);
            window.addEventListener("mousemove", touchMoveFun);
        }
    };

    const stopSwiping = () => {
        if (startedSwiping) {
            window.removeEventListener("touchmove", touchMoveFun);
            window.removeEventListener("mousemove", touchMoveFun);
            stopSwipngSetTimeout = setTimeout(() => (hover = false), speed * 2);
            if (temXpos) {
                curIndex = Math.round(Math.abs(temXpos / (100 / show)));
                slideStyle(speed / 1000 / 1.5);
            }
            startedSwiping = false;
        }
    };

    parent.addEventListener("touchstart", startSwiping);
    parent.addEventListener("mousedown", startSwiping);

    parent.addEventListener("touchend", stopSwiping);
    window.addEventListener("mouseup", stopSwiping);

    parent.addEventListener("mouseleave", () => {
        hover = false;
    });

    window.addEventListener("resize", () => {
        temTimer && clearTimeout(temTimer);
        temTimer = setTimeout(() => {
            hanResize();
            resetpos();
        }, 200);
    });

    auto &&
        setInterval(() => {
            !hover && fs(auto?.deraction || 1);
        }, auto?.delay || 2000);

    //button addeventlistener

    //resetpos
    function resetpos() {
        curIndex = cloneCount;
        styleSheet.style = `transform: translate3d(${
            (-100 / show) * curIndex
        }%, 0px, 0px);transition: all ${speed / 1000}s ease 0s`;
    }

    //slide function
    function fs(sign = 1) {
        // let r;

        const temI = curIndex + to * sign;
        const temI2 = temI + to * sign;
        const temRevArr = [...tempArr].reverse();
        playBack = (sign = 1) => {
            console.log(curIndex);
            let pospre = mainArr[curIndex] - to,
                posnxt = mainArr[curIndex] + show + to;

            posnxt > total ? (posnxt = posnxt % total) : null;
            pospre < 0 ? (pospre = temRevArr[-1 * pospre - 1]) : null;
            if (sign == -1) {
                for (let i = 0; i < mainArr.length; i++) {
                    if (i <= curIndex) {
                        continue;
                    }
                    if (
                        mainArr[i] == mainArr[curIndex] &&
                        mainArr[i - to] == pospre
                    ) {
                        curIndex = i;
                        // console.log(goto);
                        break;
                    }
                }
            } else {
                for (let i = mainArr.length; i > -1; i--) {
                    if (i >= curIndex) {
                        continue;
                    }
                    // console.log('kdjk')
                    if (
                        mainArr[i] == mainArr[curIndex] &&
                        mainArr[i + show + to] == posnxt
                    ) {
                        curIndex = i;
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
            }

            // console.log(curIndex);
            if (temI2 < 0 || temI2 > mainArr.length - show) {
                setTimeout(() => playBack(sign), speed);
            }
        }
        console.log(curIndex);
    }

    function slideStyle(transition = speed / 1000) {
        slide.style = `transform: translate3d(${
            (-100 / show) * curIndex
        }%, 0px, 0px);${
            transition ? `transition: all ${transition}s ease 0s` : ""
        }`;
    }

    const click = (e, s = 1) => {
        e.addEventListener("click", () => {
            clearTimeout(clickTimeoutId);
            hover = true;
            clickTimeoutId = setTimeout(() => (hover = false), speed * 2);
            fs(s);
        });
    };

    return { click };
}
