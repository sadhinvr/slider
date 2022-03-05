class Slider {
    constructor(parent, set) {
        const z = this;
        z.p = parent; //parent
        //responsive
        set?.res ? (z.res = set.res) : (z.res = { all: { show: 2, to: 1 } });
        !z.res.all &&
            (z.res.all = {
                o: set?.show || 2,
                to: set?.to || 1,
            });

        //
        z.o = z.res.all.show;
        z.to = z.res.all.to; //slideby
        z.fr();

        z.sp = set?.speed || 500; //speed
        z.at = set?.auto || false;
        z.at &&
            setInterval(() => {
                !z.hover && z.fs(z.at?.deraction || 1);
            }, z.at?.delay || 2000);

        z.ss = document.createElement("style");
        document.head.appendChild(z.ss);
        z.ss.sheet.insertRule(`
        .slider-item {
            min-width: calc((100% / ${z.o}) - 16px);
            max-width: calc((100% / ${z.o}) - 16px);
        }
        `);
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

        const btn = (s = 1) => {
            clearTimeout(z.preBtnTimeOut);
            z.hover = true;
            z.preBtnTimeOut = setTimeout(() => (z.hover = false), z.sp * 2);
            z.fs(s);
        };
        set?.nxt?.addEventListener("click", () => btn());
        set?.pre?.addEventListener("click", () => btn(-1));
    }

    //getitemsmax
    gm() {
        const arr = [];
        this.o < this.t && arr.push(this.o);
        !arr.length && arr.push(0);
        return Math.ceil(Math.max.apply(null, arr));
    }
    //getCloneCountForLoop
    gcc() {
        let itemsMax = this.gm(),
            result = Math.ceil((itemsMax * 5 - this.t) / 2);
        result = Math.max(itemsMax, result);
        return result;
    }

    //initstucture
    ins() {
        const z = this;
        if (z.cc) {
            let fragmentBefore = document.createDocumentFragment(),
                fragmentAfter = document.createDocumentFragment();

            z.ta = []; //temp array

            [...z.i].forEach((e, i) => {
                e.dataset.id = i;
                z.ta.push(i);
            });

            for (let j = z.cc; j--; ) {
                let num = j % z.t,
                    cloneFirst = z.i[num].cloneNode(true),
                    lastIndex = z.t - 1 - num,
                    cloneLast = z.i[lastIndex].cloneNode(true);

                cloneFirst.classList.add("clone");
                fragmentAfter.insertBefore(
                    cloneFirst,
                    fragmentAfter.firstChild
                );

                cloneLast.classList.add("clone");
                fragmentBefore.appendChild(cloneLast);
            }

            z.s.insertBefore(fragmentBefore, z.s.firstChild);
            z.s.appendChild(fragmentAfter);

            [...z.i].forEach((ele) => z.a.push(ele.dataset.id * 1));

            z.rp();
        }
    }

    //resetpos
    rp() {
        this.c = this.cc;
        this.s.style = `transform: translate3d(${
            (-100 / this.o) * this.c
        }%, 0px, 0px);transition: all ${this.sp / 1000}s ease 0s`;
    }

    //slidefunction
    fs(sign = 1) {
        // let r;
        const z = this;
        const temI = z.c + z.to * sign;
        const temI2 = temI + z.to * sign;
        const temRevArr = [...z.ta].reverse();
        z.playBack = (sign = 1) => {
            console.log(z.c);
            let pospre = z.a[z.c] - z.to,
                posnxt = z.a[z.c] + z.o + z.to;

            posnxt > z.t ? (posnxt = posnxt % z.t) : null;
            pospre < 0 ? (pospre = temRevArr[-1 * pospre - 1]) : null;
            if (sign == -1) {
                for (let i = 0; i < z.a.length; i++) {
                    if (i <= z.c) {
                        continue;
                    }
                    if (z.a[i] == z.a[z.c] && z.a[i - z.to] == pospre) {
                        z.c = i;
                        // console.log(goto);
                        break;
                    }
                }
            } else {
                for (let i = z.a.length; i > -1; i--) {
                    if (i >= z.c) {
                        continue;
                    }
                    // console.log('kdjk')
                    if (z.a[i] == z.a[z.c] && z.a[i + z.o + z.to] == posnxt) {
                        z.c = i;
                        break;
                    }
                }
            }

            z.s.style = `transform: translate3d(${
                (-100 / z.o) * z.c
            }%, 0px, 0px);transition: all 0s ease 0s`;
        };

        if (sign) {
            if (temI >= 0 && temI <= z.a.length - z.o) {
                z.c = temI;
                z.s.style = `transform: translate3d(${
                    (-100 / z.o) * z.c
                }%, 0px, 0px);transition: all ${z.sp / 1000}s ease 0s`;
            }

            // console.log(z.c);
            if (temI2 < 0 || temI2 > z.a.length - z.o) {
                setTimeout(() => z.playBack(sign), z.sp);
            }
        }
        console.log(z.c);
    }

    //reponsive function
    fr() {
        const z = this;
        let temTimer,
            keys = Object.keys(z.res)
                .filter((k) => k * 1)
                .map((k) => k * 1)
                .sort((a, b) => a - b);

        z.hanResize = () => {
            const x =
                [...keys, window.innerWidth]
                    .sort((a, b) => a - b)
                    .findIndex((a) => a == window.innerWidth) - 1;
            if (x != -1) {
                const bp = z.res[keys[x]];
                z.o = bp?.o || z.o;
                z.to = bp?.to || z.to;
            } else {
                z.o = z.res.all.o;
                z.to = z.res.all.to;
            }

            let tempStyle = `calc((100% / ${z.o}) - 16px)`,
                style = z.ss.sheet.cssRules[0].style;
            style.maxWidth = tempStyle;
            style.minWidth = tempStyle;
        };

        window.addEventListener("resize", (e) => {
            temTimer && clearTimeout(temTimer);
            temTimer = setTimeout(() => {
                z.hanResize();
                z.rp();
            }, 200);
        });
    }

    //set events function
    ev() {
        const z = this;
        z.p.addEventListener("mouseover", () => {
            z.hover = true;
        });

        const startSwiping = (e) => {
            z.ssb = true;
            z.sts && clearTimeout(z.sts);
            e.cancelable && e.preventDefault();
            e.stopPropagation();
            z.hover = true;
            if(e.clientX || e.touches){
                let react = z.p.getBoundingClientRect(),
                    temX = (e.clientX || e.touches[0].clientX) - react.x,
                    temCurInd = z.c,
                    calPos = (e) => {
                        z.txp =
                            (-100 / z.o) * temCurInd -
                            ((temX -
                                (e.clientX || e.touches[0].clientX) -
                                react.x) /
                                react.width) *
                                100;
                    };
                // console.log('touchstart');
    
                //touch move function
                z.fmt = (e) => {
                    calPos(e);
                    z.c = Math.round(Math.abs(z.txp / (100 / z.o)));
    
                    if (z.txp <= (z.a.length - z.o) * (-100 / z.o) || z.txp >= 0) {
                        // temCurInd=z.c;
                        // console.log(z.c)
                        temX = (e.clientX || e.touches[0].clientX) - react.x;
                        z.playBack(z.txp >= 0 ? -1 : 1);
                        temCurInd = z.c;
                        calPos(e);
    
                        // z.txp = (-100 / z.o) * z.c;
                        console.log((-100 / z.o) * z.c);
                    }
    
                    // console.log(z.txp)
                    z.s.style = `transform: translate3d(${z.txp}%, 0px, 0px);transition:0s`;
                };
                window.addEventListener("touchmove", z.fmt);
                window.addEventListener("mousemove", z.fmt);
            }
        };

        const stopSwiping = (e) => {
            if (z.ssb) {
                window.removeEventListener("touchmove", z.fmt);
                window.removeEventListener("mousemove", z.fmt);
                z.sts = setTimeout(() => (z.hover = false), z.sp * 2);
                if (z.txp) {
                    z.c = Math.round(Math.abs(z.txp / (100 / z.o)));
                    z.s.style = `transform: translate3d(${
                        (-100 / z.o) * z.c
                    }%, 0px, 0px);transition: all ${
                        z.sp / 1000 / 1.5
                    }s ease 0s`;
                }
                z.ssb = false;
            }
        };

        z.p.addEventListener("touchstart", startSwiping);
        z.s.addEventListener("mousedown", startSwiping);

        z.p.addEventListener("touchend", stopSwiping);
        window.addEventListener("mouseup", stopSwiping);

        z.p.addEventListener("mouseleave", () => {
            z.hover = false;
        });
    }
}
