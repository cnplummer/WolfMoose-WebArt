var audioCtx,       //The context of the Web Audio API - neccesary for node 
                    //linking
    gainNode0,       //The gain node, routed as: source => gainNode =>
                    //destination
    btnPlay,        //HTML button for "playing" source
    btnStop,        //HTML button for "pausing" source
    btnReset,       //HTML button for restarting the audio
    source2,
    source1,
    source0;         //The AudioNode that holds the audio output from the HTML
                    //audio source
    
//plays the source audio
function buttonPlay() {
    "use strict";
    source0.mediaElement.play();
    source1.mediaElement.play();
    source2.mediaElement.play();
/*    btnPlay.disabled = true;
    btnStop.disabled = false;*/
}

//pauses the source audio
function buttonPause() {
    "use strict";
    source0.mediaElement.pause();
    source1.mediaElement.pause();
    source2.mediaElement.pause();
/*    btnPlay.disabled = false;
    btnStop.disabled = true;*/
}

//resets the audio source to the beginning
function resetSource() {
    "use strict";
    source0.mediaElement.currentTime = 0;
    source1.mediaElement.currentTime = 0;
    source2.mediaElement.currentTime = 0;
}

//Create an audio context from the HTML5 audio source
audioCtx = new window.AudioContext();

source0 = audioCtx.createMediaElementSource(document.getElementById("srcEnv"));
source1 = audioCtx.createMediaElementSource(document.getElementById("srcWolf"));
source2 = audioCtx.createMediaElementSource(document.getElementById("srcMoose"));

//Define Nodes to be connected
gainNode0 = audioCtx.createGain();
gainNode1 = audioCtx.createGain();
gainNode2 = audioCtx.createGain();

//Connect Nodes:
//Source --> GainNode --> Destination
source0.connect(gainNode0);
gainNode0.connect(audioCtx.destination);

source1.connect(gainNode1);
gainNode1.connect(audioCtx.destination);

source2.connect(gainNode2);
gainNode2.connect(audioCtx.destination);

btnPlay = document.getElementById("btnPlay");
btnStop = document.getElementById("btnStop");
btnReset = document.getElementById("btnReset");

/*
btnPlay.onclick = buttonPlay;
btnStop.onclick = buttonPause;
btnReset.onclick = resetSource;
*/

/*btnStop.disabled = true;*/

//Initilize Gain to zero
gainNode0.gain.value = 0;
gainNode1.gain.value = 0;
gainNode2.gain.value = 0;

//Play all tracks initially
buttonPlay();

