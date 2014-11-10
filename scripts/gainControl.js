var btnMinus,       //HTML button for decreasing the gain in the gainNode
    btnPlus,        //HTML button for increasing the gain in the gainNode
    btnToggleMouse, //HTML button enable/disable mouse gain control
    gainLabel,      //<p> that holds the value of the gainNode.
    gainValue,      //The stored value of the gain: a value 0 - 1
    mouseCntl,      //Boolean, true if browser is reading mouse input
    slide;          //HTML input for controling gain, range 0 - 100
    
    

//takes a numeric value. Forces the value into a range [0,1]. If value is not
//within that range, it is forced to be the closest edge. Ex: -5 -> 0.
function encapGain(value) {
    "use strict";
    if (value > 0.99) {
        value = 1;
    } else if (value < 0.01) {
        value = 0;
    }
    return value;
}

//Displays the value of gainValue in a HTML paragraph. Is called after every
//change to the value of gainValue.
function updateGainLabel() {
    "use strict";
    gainLabel.innerHTML = "Current Gain: " + gainValue.toPrecision(2);
}


//increasing the gain by 0.1 to a maximum of 1.
function gainIncrease() {
    "use strict";
    gainValue += 0.1;
    gainValue = encapGain(gainValue);
    gainNode.gain.value = gainValue;
    updateGainLabel();
}

//decreases the gain by 0.1 to a minimum of 0
function gainDecrease() {
    "use strict";
    gainValue -= 0.1;
    gainValue = encapGain(gainValue);
    gainNode.gain.value = gainValue;
    updateGainLabel();
}

//sets the gain to a value between 0 and 1 with 101 discrete positions.
//Overrides gain set by button control.
function gainSlider() {
    "use strict";
    gainValue = slide.valueAsNumber / 100.0;
    gainNode.gain.value = gainValue;
    updateGainLabel();
}

//Activates and deactivat the mouse control on a toggle system. Tied into the
//button press.
function toggleMouseControl() {
    "use strict";
    if (mouseCntl) {
        mouseCntl = false;
        btnToggleMouse.innerHTML = "Disabled";
    } else {
        mouseCntl = true;
        btnToggleMouse.innerHTML = " Enabled ";
    }
}

//Activated on mouse moving, calculates mouse height on the screen and adjusts
//gain depending on height
function mouseGainControl(e) {
    "use strict";
    if (mouseCntl) {
        gainValue = encapGain((window.innerHeight - e.pageY) / window.innerHeight);
        gainNode.gain.value = gainValue;
        updateGainLabel();
    }
}

//Stores the current value for the gainNode. Should never excede [0,1].
gainValue = 0.5;

//Set the default value (disabled) to mouse control
mouseCntl = false;

//obtain the object of each of the HTML control systems
btnPlus = document.getElementById("btnPlus");
btnMinus = document.getElementById("btnMinus");
slide = document.getElementById("gainSlide");
btnToggleMouse = document.getElementById("toggleMouse");
gainLabel = document.getElementById("gainDisplay");

//Assign functions to each button to execute on activation
btnPlus.onclick = gainIncrease;
btnMinus.onclick = gainDecrease;

//Assign function to activate whenever the position of the slider changes
slide.onchange = gainSlider;

//Set method for enabling/disabling the mouse gain control.
btnToggleMouse.onclick = toggleMouseControl;

//Detect when mouse is moved over the browser window.
document.addEventListener('mousemove', mouseGainControl, false);

//initial update of the value of current gain.
updateGainLabel();