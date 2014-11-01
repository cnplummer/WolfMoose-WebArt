//Create an audio context from the HTML5 audio source
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source = audioCtx.createMediaElementSource(document.getElementById("src1"));

//Define Nodes to be connected
var gainNode = audioCtx.createGain();

//Connect Nodes:
//Source --> GainNode --> Destination
source.connect(gainNode);
gainNode.connect(audioCtx.destination);

//Stores the current value for the gainNode. Should never excede [0,1].                          
var gainValue = 0.5;

var btnPlay = document.getElementById("btnPlay");
btnPlay.onclick = function () {source.mediaElement.play(); };

var btnStop = document.getElementById("btnStop");
btnStop.onclick = function () {source.mediaElement.pause(); };

var btnPlus = document.getElementById("btnPlus");
btnPlus.onclick = function () {
    gainValue += 0.1;
    if(gainValue > 1){
        gainValue = 1;
    }else if(gainValue < 0){
        gainValue = 0;
    }
    gainNode.gain.value = gainValue;
    console.log(gainNode.gain.value); 
};

var btnMinus = document.getElementById("btnMinus");
btnMinus.onclick = function () { gainValue -= 0.1;  gainNode.gain.value = gainValue; console.log(gainNode.gain.value); };

var slide = document.getElementById("gainSlide");    
slide.onchange = function () { gainValue = slide.valueAsNumber / 100.0; gainNode.gain.value = gainValue; console.log(gainNode.gain.value); };

function encapGain(){
    if(gainValue > 1){
        gainValue = 1;
    }else if(gainValue < 0){
        gainValue = 0;
    }
}
