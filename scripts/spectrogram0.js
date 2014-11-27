

//Draws the spectrogram onto the canvas
function drawSpectrogram(array) {
    "use strict";
    // copy the current canvas onto the temp canvas
    tempCtx0.drawImage(canvas0, 0, 0, 400, 256);

    // iterate over the elements from the array
    for (var i = 0; i < array.length; i += 1) {
        // draw each pixel with the specific color
        var value = array[i];
        ctx0.fillStyle = hot.getColor(value).hex();

        // draw the line at the right side of the canvas
        ctx0.fillRect(400 - 1, 256 - i, 1, 1);
    }

    // set translate on the canvas
    ctx0.translate(-1, 0);
    // draw the copied image
    ctx0.drawImage(tempCanvas0, 0, 0, 400, 256, 0, 0, 400, 256);
    // reset the transformation matrix
    ctx0.setTransform(1, 0, 0, 1, 0, 0);
}

//function called by the javascript node
function audioProcess() {
    "use strict";
    // get the average for the first channel
    var array = new Uint8Array(analyser0.frequencyBinCount);
    analyser0.getByteFrequencyData(array);

    // draw the spectrogram
    if (!source0.mediaElement.paused) {
        //console.log(document.getElementById("src1").paused);
        drawSpectrogram(array);
    }
}

//pull the canvas into a variable
canvas0 = document.getElementById("canvas0");

// get the audioCtx from the canvas to draw on
ctx0 = $("#canvas0").get()[0].getContext("2d");

// create a temp canvas we use for copying
tempCanvas0 = document.createElement("canvas");
tempCtx0 = tempCanvas0.getContext("2d");
tempCanvas0.width = 400;
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
analyser0 = audioCtx.createAnalyser();
analyser0.smoothingTimeConstant = 0;
analyser0.fftSize = 512;

// create a buffer source node
gainNode0.connect(analyser0);
analyser0.connect(javascriptNode0);


// when the javascript node is called
// we use information from the analyzer node
// to draw the volume
javascriptNode0.onaudioprocess = audioProcess;