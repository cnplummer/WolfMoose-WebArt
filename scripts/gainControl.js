    

//sets the gain to a value between 0 and 1 with 101 discrete positions.
//Overrides gain set by button control.
function gainSlider0() {
    "use strict";
    var gainValue0 = slide0.valueAsNumber / 100.0;
    gainNode0.gain.value = gainValue0;
}

var slide0 = document.getElementById("gainSlide0");

//Assign function to activate whenever the position of the slider changes
slide0.onchange = gainSlider0;

function gainSlider1() {
    "use strict";
    var gainValue1 = slide1.valueAsNumber / 100.0;
    gainNode1.gain.value = gainValue1;
}

var slide1 = document.getElementById("gainSlide1");

//Assign function to activate whenever the position of the slider changes
slide1.onchange = gainSlider1;

function gainSlider2() {
    "use strict";
    var gainValue2 = slide2.valueAsNumber / 100.0;
    gainNode2.gain.value = gainValue2;
}

var slide2 = document.getElementById("gainSlide2");

//Assign function to activate whenever the position of the slider changes
slide2.onchange = gainSlider2;
