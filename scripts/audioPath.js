var audioCtx,       //The context of the Web Audio API - neccesary for node 
                    //linking
    gainNode,       //The gain node, routed as: source => gainNode =>
                    //destination
    btnPlay,        //HTML button for "playing" source
    btnStop,        //HTML button for "pausing" source
    btnReset;       //HTML button for restarting the audio
    
//plays the source audio
function buttonPlay() {
    "use strict";
    source.mediaElement.play();
}

//pauses the source audio
function buttonPause() {
    "use strict";
    source.mediaElement.pause();
}

//resets the audio source to the beginning
function resetSource() {
    "use strict";
    source.mediaElement.currentTime = 0;
}

//Create an audio context from the HTML5 audio source
audioCtx = new window.AudioContext();

source = audioCtx.createMediaElementSource(document.getElementById("srcEnv"));

//Define Nodes to be connected
gainNode = audioCtx.createGain();

//Connect Nodes:
//Source --> GainNode --> Destination
source.connect(gainNode);
gainNode.connect(audioCtx.destination);

btnPlay = document.getElementById("btnPlay");
btnStop = document.getElementById("btnStop");
btnReset = document.getElementById("btnReset");

btnPlay.onclick = buttonPlay;
btnStop.onclick = buttonPause;
btnReset.onclick = resetSource;