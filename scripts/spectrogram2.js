

//Draws the spectrogram onto the canvas
function drawSpectrogram2(array) {
    "use strict";
    // copy the current canvas onto the temp canvas
    tempCtx2.drawImage(canvas2, 0, 0, 400, 256);

    // iterate over the elements from the array
    for (var i = 0; i < array.length; i += 1) {
        // draw each pixel with the specific color
        var value = array[i];
        ctx2.fillStyle = hot.getColor(value).hex();

        // draw the line at the right side of the canvas
        ctx2.fillRect(400 - 1, 256 - i, 1, 1);
    }

    // set translate on the canvas
    ctx2.translate(-1, 0);
    // draw the copied image
    ctx2.drawImage(tempCanvas2, 0, 0, 400, 256, 0, 0, 400, 256);
    // reset the transformation matrix
    ctx2.setTransform(1, 0, 0, 1, 0, 0);
}

//function called by the javascript node
function audioProcess2() {
    "use strict";
    // get the average for the first channel
    var array = new Uint8Array(analyser2.frequencyBinCount);
    analyser2.getByteFrequencyData(array);

    // draw the spectrogram
    if (!source2.mediaElement.paused) {
        //console.log(document.getElementById("src1").paused);
        drawSpectrogram2(array);
    }
}

//pull the canvas into a variable
canvas2 = document.getElementById("canvas2");

// get the audioCtx from the canvas to draw on
ctx2 = $("#canvas2").get()[0].getContext("2d");

// create a temp canvas we use for copying
tempCanvas2 = document.createElement("canvas");
tempCtx2 = tempCanvas2.getContext("2d");
tempCanvas2.width = 400;
tempCanvas2.height = 256;

// used for color distribution
hot = new chroma.ColorScale({
    colors: ['#000000', '#ff0000', '#ffff00', '#ffffff'],
    positions: [0, 0.25, 0.75, 1],
    mode: 'rgb',
    limits: [0, 300]
});

// setup a javascript node [affects speed]
javascriptNode2 = audioCtx.createScriptProcessor(2048, 1, 1);
// connect to destination, else it isn't called
javascriptNode2.connect(audioCtx.destination);

// setup a analyzer
analyser2 = audioCtx.createAnalyser();
analyser2.smoothingTimeConstant = 0;
analyser2.fftSize = 512;

// create a buffer source node
gainNode2.connect(analyser2);
analyser2.connect(javascriptNode2);


// when the javascript node is called
// we use information from the analyzer node
// to draw the volume
javascriptNode2.onaudioprocess = audioProcess2;