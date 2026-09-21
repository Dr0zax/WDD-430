const style = document.createElement('style');
style.innerHTML = `
html, body {
    height: 100%;
}

body {
    display: flex;
    flex-direction: column-reverse;
    padding-bottom: 30px;
}

.chapel-color {
    background-color: #cac6c5;
}
.chapel-base {
    width: 100%;
    height: 40px;    
}
    
.chapel-layer {
    background-color: #d7d4d3;
    height: 35px;
    margin: 0 auto;
}
    
.chapel-wrapper {
    position: relative;
}
    
.center-bar {
    background-color: #e6e6e6;
    width: 10px;
    position: absolute;
    left: 50%;
    top: -40px;
    bottom: 40px
}

.vertical-bar {
    width: 10px;
    position: relative;
    background-color: #f1f1f1;
}
    
.layer-1 {background-color: #e9e5e4 }
.layer-2 {background-color: #cac6c5 }
.layer-3 {background-color: #d6d2d1 }
.layer-4 {background-color: #e9e5e4 }
.layer-5 {background-color: #f5f1f0 }
`

function addToEl(parent, child) {
    parent.appendChild(child);
}

function addClass(e, name) {
    e.classList.add(name);
}


function div(classNames = '') {
    const el = document.createElement('div');
    el.className += classNames
    return el
}

function addTaylorLayer(parent, num, classNames = '') {
    const BASE_PERCENT = 15;
    const LAYER_WIDTH = BASE_PERCENT * num;
    const el = div();
    el.style.width = `${LAYER_WIDTH}%`;
    addClass(el, 'chapel-layer');
    el.className += classNames;
    addToEl(parent, el);
}

function addTaylorVerticalBar(num, parent, classNames='') {
    const LEFT_PERCENT = 8.5;
    const HEIGHT = 35;
    const el = div('vertical-bar');
    el.style.height = HEIGHT;
    el.style.left = `${LEFT_PERCENT * num}%`
    el.className += classNames;
    addToEl(parent, el);
}

document.head.appendChild(style);

const wrapper = div('chapel-wrapper');

const baseLayer = div('chapel-color chapel-base');

for (let i = 1; i < 6; i++) {
    addTaylorLayer(wrapper, i, ` layer-${i}`);
}

for (let i = 0; i <= 10; i++) {
    addTaylorVerticalBar(i, wrapper)
}

addToEl(document.body, baseLayer);
addToEl(document.body, wrapper);

const centerBar = div('center-bar');
addToEl(wrapper, centerBar);