# Infinite slider / carousel (5kb) 🚀
Vanilla Javascript slider. Swipe or drag , responsive slider items.

[>>>Demo<<<](https://sadhinvr.github.io/slider/lib/index.html)

#### Features:-
- Infinite
- fast, responsive
- light weight
- no-jquery, Es-5
- swipe & drag


# Getting started

### 1.copy & paste before ending body tag

```html
<script src="https://sadhinvr.github.io/slider/lib/slider.min.js"></script>
```

### 2.HTML & CSS

```css
.carousel {
    overflow: hidden;
    max-width: 100%;
}

.slide {
    display: flex;
    column-gap: 16px;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}
```

```html
<div class="carousel">
  <div class="slide">
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>

<button id="pre">prev</button>
<button id="nxt">next</button>
```

### 3. Settings

```js
// selecting dom element
const element = document.querySelector('.carousel'); //add your selector name .class/#id 

// call the function slider parameters:-
// 1. parent/main element
// 2. Object for options -eg: {auto:true}
const mySlider = slider(element,{auto:true});

```

#### 4. Next & Previos Button
```js
const previousBtn= document.querySelector('#pre');
const nextBtn =  document.querySelector('#nxt');
    
mySlider.click(previousBtn,-1) //2nd parameter -1 refers to negative positioning & default is +1
mySlider.click(nextBtn) // default is +1 so you don't have to write twice
```

## Options

| Option | Default-Value | Description |
| :----: | :----: | ----------- |
| show      | 2 | how many items it will display ⚠️ don't set it equal to total items or getter. If you have total 5 items you can show maximum 4. |
| to   | 1 | it's how many items it will slide by ⚠️ don't set it getter then show it may create issues |
| gutter  | 16 | This is the gap between slide items. Default 16 -it means 16px |
| auto | false | If you want autoplay set this to true. Default delay is 2000 -it means 2sec. To set the delay write auto:{delay:<time in milisecond>} instead of true. eg- auto:{delay:3000} -it means 3sec.|
| responsive | { } | You can set break points. bellow for more details |
  
### responsive

Example code:
```js
responsive: {
    900: {          // here 900 is breakpoint. It means it will show 4 items, slide 4 & gutter 20px in 900 or bigger screens
        show: 4,    // show, to , gutter are optional. Use as you need 😊
        to: 4,
        gutter: 20
    }, 700: {
        show: 3,
        to: 3,
        gutter: 16
    },200:{
        show:2,
        to:1,
        gutter: 10
    }
}

```




#### ⚠️ This is on devlopment mode.
