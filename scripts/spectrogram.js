var context,
    audioBuffer,
    sourceNode,
    analyser,
    javascriptNode,
    ctx,
    tempCanvas,
    tempCtx,
    hot,
    array,
    canvas,
    value,
    i;

// log if an error occurs
function onError(e) {
    "use strict";
    console.log(e);
}

function drawSpectrogram(array) {
    "use strict";
    // copy the current canvas onto the temp canvas
    canvas = document.getElementById("canvas");

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

function setupAudioNodes() {
    "use strict";
    // setup a javascript node
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);

    // setup a analyzer
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0;
    analyser.fftSize = 1024;

    // create a buffer source node
    //sourceNode = context.createBufferSource();
    gainNode.connect(analyser);
    analyser.connect(javascriptNode);

   // sourceNode.connect(context.destination);
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

context = audioCtx;
// get the context from the canvas to draw on
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

// load the sound
setupAudioNodes();

// when the javascript node is called
// we use information from the analyzer node
// to draw the volume
javascriptNode.onaudioprocess = audioProcess;