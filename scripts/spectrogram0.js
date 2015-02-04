

//Draws the spectrogram onto the canvas
function drawSpectrogram0(array) {
    "use strict";
    // copy the current canvas onto the temp canvas
    tempCtx0.drawImage(canvas0, 0, 0, 350, 256);

    // iterate over the elements from the array
    for (var i = 0; i < array.length; i += 1) {
        // draw each pixel with the specific color
        var value = array[i];
        ctx0.fillStyle = hot.getColor(value).hex();

        // draw the line at the right side of the canvas
        ctx0.fillRect(350 - 1, 256 - i, 1, 1);
    }

    // set translate on the canvas
    ctx0.translate(-1, 0);
    // draw the copied image
    ctx0.drawImage(tempCanvas0, 0, 0, 350, 256, 0, 0, 350, 256);
    // reset the transformation matrix
    ctx0.setTransform(1, 0, 0, 1, 0, 0);
}

//function called by the javascript node
function audioProcess0() {
    "use strict";
    // get the average for the first channel
    var array = new Uint8Array(analyser0.frequencyBinCount);
    analyser0.getByteFrequencyData(array);

    // draw the spectrogram
    if (!source0.mediaElement.paused) {
        //console.log(document.getElementById("src1").paused);
        drawSpectrogram0(array);
    }
}

//pull the canvas into a variable
canvas0 = document.getElementById("canvas0");

// get the audioCtx from the canvas to draw on
ctx0 = $("#canvas0").get()[0].getContext("2d");

// create a temp canvas we use for copying
tempCanvas0 = document.createElement("canvas");
tempCtx0 = tempCanvas0.getContext("2d");
tempCanvas0.width = 350;
tempCanvas0.height = 256;

// used for color distribution
hot = new chroma.ColorScale({
    colors: ['#000000', '#ff0000', '#ffff00', '#ffffff'],
    positions: [0, 0.25, 0.75, 1],
    mode: 'rgb',
    limits: [0, 300]
});

// setup a javascript node [affects speed]
javascriptNode0 = audioCtx.createScriptProcessor(2048, 1, 1);
// connect to destination, else it isn't called
javascriptNode0.connect(audioCtx.destination);

// setup a analyzer
var analyserArray0 = new Array(256);

//Q = center_frequency / (top_frequency - bottom_frequency)
//20 - 20,000, log 10
var stepFunc0 = 4 / 256;
var arrayNum0 = 0;
for(var j=1+stepFunc0 ; j <= 4; j+=stepFunc0){
    var num0 = 2*Math.pow(10, (j+j-stepFunc0)/2);
    analyserArray0[arrayNum0] = audioCtx.createBiquadFilter();
    analyserArray0[arrayNum0].type = "bandpass";
    analyserArray0[arrayNum0].frequency.value = num0;
    analyserArray0[arrayNum0].Q.value = num0 / (2*Math.pow(10, j) - 2*Math.pow(10, j-stepFunc0));
    arrayNum0++;
}
console.log(analyserArray0[0]);

analyser0 = audioCtx.createAnalyser();
analyser0.smoothingTimeConstant = 0;
analyser0.fftSize = 512;

// create a buffer source node
gainNode0.connect(analyser0);
analyser0.connect(javascriptNode0);


// when the javascript node is called
// we use information from the analyzer node
// to draw the volume
javascriptNode0.onaudioprocess = audioProcess0;