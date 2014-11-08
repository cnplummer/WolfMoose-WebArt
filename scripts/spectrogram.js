var analyser,
    array,
    audioBuffer,
    canvas,
    ctx,
    hot,
    i,
    javascriptNode,
    sourceNode,    
    tempCanvas,
    tempCtx,
    value;

function drawSpectrogram(array) {
    "use strict";
    // copy the current canvas onto the temp canvas
    tempCtx.drawImage(canvas, 0, 0, 800, 512);

    // iterate over the elements from the array
    for (i = 0; i < array.length; i += 1) {
        // draw each pixel with the specific color
        value = array[i];
        ctx.fillStyle = hot.getColor(value).hex();

        // draw the line at the right side of the canvas
        ctx.fillRect(800 - 1, 512 - i, 1, 1);
    }

    // set translate on the canvas
    ctx.translate(-1, 0);
    // draw the copied image
    ctx.drawImage(tempCanvas, 0, 0, 800, 512, 0, 0, 800, 512);
    // reset the transformation matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function audioProcess() {
    "use strict";
    // get the average for the first channel
    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    // draw the spectrogram
    if (!source.mediaElement.paused) {
        //console.log(document.getElementById("src1").paused);
        drawSpectrogram(array);
    }
}

//pull the canvas into a variable
canvas = document.getElementById("canvas");

// get the audioCtx from the canvas to draw on
ctx = $("#canvas").get()[0].getContext("2d");

// create a temp canvas we use for copying
tempCanvas = document.createElement("canvas");
tempCtx = tempCanvas.getContext("2d");
tempCanvas.width = 800;
tempCanvas.height = 512;

// used for color distribution
hot = new chroma.ColorScale({
    colors: ['#000000', '#ff0000', '#ffff00', '#ffffff'],
    positions: [0, 0.25, 0.75, 1],
    mode: 'rgb',
    limits: [0, 300]
});

// setup a javascript node
javascriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
// connect to destination, else it isn't called
javascriptNode.connect(audioCtx.destination);

// setup a analyzer
analyser = audioCtx.createAnalyser();
analyser.smoothingTimeConstant = 0;
analyser.fftSize = 1024;

// create a buffer source node
gainNode.connect(analyser);
analyser.connect(javascriptNode);


// when the javascript node is called
// we use information from the analyzer node
// to draw the volume
javascriptNode.onaudioprocess = audioProcess;