var audioCtx,   //The context of the Web Audio API - neccesary for node linking
    source,     //The AudioNode that holds the audio output from the HTML 
                //audio source
    gainNode,   //The gain node, routed as: source => gainNode => destination
    gainValue,  //The stored value of the gain: a value 0 - 1
    btnPlay,    //HTML button for "playing" source
    btnStop,    //HTML button for "pausing" source
    btnPlus,    //HTML button for increasing the gain in the gainNode
    btnMinus,   //HTML button for decreasing the gain in the gainNode
    slide;      //HTML input for controling gain, range 0 - 100


function encapGain(value) {
    "use strict";
    if (value > 1) {
        value = 1;
    } else if (value < 0) {
        value = 0;
    }
    return value;
}

function buttonPlay() {
    "use strict";
    source.mediaElement.play();
}

function buttonPause() {
    "use strict";
    source.mediaElement.pause();
}

function gainIncrease() {
    "use strict";
    gainValue += 0.1;
    gainValue = encapGain(gainValue);
    gainNode.gain.value = gainValue;
    //console.log(gainNode.gain.value); 
}

function gainDecrease() {
    "use strict";
    gainValue -= 0.1;
    gainValue = encapGain(gainValue);
    gainNode.gain.value = gainValue;
    //console.log(gainNode.gain.value); 
}

function gainSlider() {
    "use strict";
    gainValue = slide.valueAsNumber / 100.0;
    gainNode.gain.value = gainValue;
    //console.log(gainNode.gain.value); 
}

//Create an audio context from the HTML5 audio source
audioCtx = new (window.AudioContext || window.webkitAudioContext)();
source = audioCtx.createMediaElementSource(document.getElementById("src1"));

//Define Nodes to be connected
gainNode = audioCtx.createGain();

//Connect Nodes:
//Source --> GainNode --> Destination
source.connect(gainNode);
gainNode.connect(audioCtx.destination);

//Stores the current value for the gainNode. Should never excede [0,1].                          
var gainValue = 0.5;

var btnPlay = document.getElementById("btnPlay");
var btnStop = document.getElementById("btnStop");
var btnPlus = document.getElementById("btnPlus");
var btnMinus = document.getElementById("btnMinus");
var slide = document.getElementById("gainSlide");

//Assign functions to each button to execute on activation
btnPlay.onclick = buttonPlay;
btnStop.onclick = buttonPause;
btnPlus.onclick = gainIncrease;
btnMinus.onclick = gainDecrease;

//Assign function to activate whenever the position of the slider changes
slide.onchange = gainSlider;



