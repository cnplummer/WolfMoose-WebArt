

//Draws the spectrogram onto the canvas
function drawSpectrogram1(array) {
    "use strict";
    // copy the current canvas onto the temp canvas
    tempCtx1.drawImage(canvas1, 0, 0, 400, 256);

    // iterate over the elements from the array
    for (var i = 0; i < array.length; i += 1) {
        // draw each pixel with the specific color
        var value = array[i];
        ctx1.fillStyle = hot.getColor(value).hex();

        // draw the line at the right side of the canvas
        ctx1.fillRect(400 - 1, 256 - i, 1, 1);
    }

    // set translate on the canvas
    ctx1.translate(-1, 0);
    // draw the copied image
    ctx1.drawImage(tempCanvas1, 0, 0, 400, 256, 0, 0, 400, 256);
    // reset the transformation matrix
    ctx1.setTransform(1, 0, 0, 1, 0, 0);
}

//function called by the javascript node
function audioProcess1() {
    "use strict";
    // get the average for the first channel
    var array = new Uint8Array(analyser1.frequencyBinCount);
    analyser1.getByteFrequencyData(array);

    // draw the spectrogram
    if (!source1.mediaElement.paused) {
        //console.log(document.getElementById("src1").paused);
        drawSpectrogram1(array);
    }
}

//pull the canvas into a variable
canvas1 = document.getElementById("canvas1");

// get the audioCtx from the canvas to draw on
ctx1 = $("#canvas1").get()[0].getContext("2d");

// create a temp canvas we use for copying
tempCanvas1 = document.createElement("canvas");
tempCtx1 = tempCanvas1.getContext("2d");
tempCanvas1.width = 400;
tempCanvas1.height = 256;

// used for color distribution
hot = new chroma.ColorScale({
    colors: ['#000000', '#ff0000', '#ffff00', '#ffffff'],
    positions: [0, 0.25, 0.75, 1],
    mode: 'rgb',
    limits: [0, 300]
});

// setup a javascript node [affects speed]
javascriptNode1 = audioCtx.createScriptProcessor(2048, 1, 1);
// connect to destination, else it isn't called
javascriptNode1.connect(audioCtx.destination);

// setup a analyzer
analyser1 = audioCtx.createAnalyser();
analyser1.smoothingTimeConstant = 0;
analyser1.fftSize = 512;

// create a buffer source node
gainNode1.connect(analyser1);
analyser1.connect(javascriptNode1);


// when the javascript node is called
// we use information from the analyzer node
// to draw the volume
javascriptNode1.onaudioprocess = audioProcess1;