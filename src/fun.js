function slider(parent, set) {
    let responsive = {
            ...(set?.responsive || {}),
            all: { show: set?.show || 2, to: set?.to || 1 },
        },
        show = responsive.all.show,
        to = responsive.all.to, //resize
        speed = set?.speed || 500,
        auto = set?.auto, //setinterval
        styleSheet = document.createElement("style"), //append it to head & insert rule
        //han resize
        slide = parent.firstElementChild,
        slideItems = slide.children,
        total = slideItems.length,
        cloneCount = Math.max(show, Math.ceil((show * 5 - total) / 2)),
        temCloneCount = total + cloneCount * 2,
        index = cloneCount,
        maxIndex = Math.max(0, temCloneCount - show), //
        mainArr = [],
        tempArr = [],
        curIndex = 0,
        hanResize,
        playBack,
        hover,
        startedSwiping,
        stopSwipngSetTimeout,
        temXpos,
        touchMoveFun;

    document.head.appendChild(styleSheet);
    styleSheet.sheet.insertRule(`
        .slider-item {
            min-width: calc((100% / ${show}) - 16px);
            max-width: calc((100% / ${show}) - 16px);
        }
        `);
    initstucture();
    responsiveFun();
    hanResize();
    fs();
    ev();

    auto &&
            setInterval(() => {
                !hover && fs(auto?.deraction || 1);
            }, auto?.delay || 2000);
    //structure\\
    //slide function
    //event funtion
    //button addeventlistener

    //response setting
    function responsiveFun() {
        let temTimer,
            keys = Object.keys(responsive)
                .filter((k) => k * 1)
                .map((k) => k * 1)
                .sort((a, b) => a - b);

        hanResize = () => {
            const x =
                [...keys, window.innerWidth]
                    .sort((a, b) => a - b)
                    .findIndex((a) => a == window.innerWidth) - 1;
            if (x != -1) {
                const bp = responsive[keys[x]];
                show = bp?.show || show;
                to = bp?.to || to;
            } else {
                show = responsive.all.show;
                to = responsive.all.to;
            }

            let tempStyle = `calc((100% / ${show}) - 16px)`,
                style = styleSheet.sheet.cssRules[0].style;
            style.maxWidth = tempStyle;
            style.minWidth = tempStyle;
        };

        window.addEventListener("resize", (e) => {
            temTimer && clearTimeout(temTimer);
            temTimer = setTimeout(() => {
                hanResize();
                resetpos();
            }, 200);
        });
    }

    //resetpos
    function resetpos() {
        curIndex = cloneCount;
        styleSheet.style = `transform: translate3d(${
            (-100 / show) * curIndex
        }%, 0px, 0px);transition: all ${speed / 1000}s ease 0s`;
    }

    //initstucture
    function initstucture() {
        if (cloneCount) {
            let fragmentBefore = document.createDocumentFragment(),
                fragmentAfter = document.createDocumentFragment();

            [...slideItems].forEach((e, i) => {
                e.dataset.id = i;
                tempArr.push(i);
            });

            for (let j = cloneCount; j--; ) {
                let num = j % total,
                    cloneFirst = slideItems[num].cloneNode(true),
                    lastIndex = total - 1 - num,
                    cloneLast = slideItems[lastIndex].cloneNode(true);

                cloneFirst.classList.add("clone");
                fragmentAfter.insertBefore(
                    cloneFirst,
                    fragmentAfter.firstChild
                );

                cloneLast.classList.add("clone");
                fragmentBefore.appendChild(cloneLast);
            }

            slide.insertBefore(fragmentBefore, slide.firstChild);
            slide.appendChild(fragmentAfter);

            [...slideItems].forEach((ele) => mainArr.push(ele.dataset.id * 1));

            resetpos();
        }
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
                    if (mainArr[i] == mainArr[curIndex] && mainArr[i - to] == pospre) {
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
                    if (mainArr[i] == mainArr[curIndex] && mainArr[i + show + to] == posnxt) {
                        curIndex = i;
                        break;
                    }
                }
            }

            slide.style = `transform: translate3d(${
                (-100 / show) * curIndex
            }%, 0px, 0px);transition: all 0s ease 0s`;
        };

        if (sign) {
            if (temI >= 0 && temI <= mainArr.length - show) {
                curIndex = temI;
                slide.style = `transform: translate3d(${
                    (-100 / show) * curIndex
                }%, 0px, 0px);transition: all ${speed / 1000}s ease 0s`;
            }

            // console.log(curIndex);
            if (temI2 < 0 || temI2 > mainArr.length - show) {
                setTimeout(() => playBack(sign), speed);
            }
        }
        console.log(curIndex);
    }

    //set events function
    function ev() {

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
                                (e.clientX || e.touches[0].clientX) -
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
                        temX = (e.clientX || e.touches[0].clientX) - react.x;
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

        const stopSwiping = (e) => {
            if (startedSwiping) {
                window.removeEventListener("touchmove", touchMoveFun);
                window.removeEventListener("mousemove", touchMoveFun);
                stopSwipngSetTimeout = setTimeout(() => (hover = false), speed * 2);
                if (temXpos) {
                    curIndex = Math.round(Math.abs(temXpos / (100 / show)));
                    slide.style = `transform: translate3d(${
                        (-100 / show) * curIndex
                    }%, 0px, 0px);transition: all ${
                        speed / 1000 / 1.5
                    }s ease 0s`;
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
    }

    console.log(total, show, cloneCount, temCloneCount);
}
