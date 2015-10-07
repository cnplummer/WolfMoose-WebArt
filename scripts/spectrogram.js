/**
 * Sets up the spectrograms.
 *
 * @author Matthew Vaught
 *         mtvaught@mtu.edu
 */

var canvasHeight,   //Height of graphics canvas
    canvasWidth,    //Width of graphics canvas
    graphicQuality, //Number of pixels per analysis
    canvas0,        canvas1,        canvas2,        //Canvas to draw on
    ctx0,           ctx1,           ctx2,           //Context from canvas
    tempCanvas0,    tempCanvas1,    tempCanvas2,    //Temp canvas to generate
    tempCtx0,       tempCtx1,       tempCtx2,       //Context from temp canvas
    javascriptNode0,javascriptNode1,javascriptNode2,//Triggers actions on audio
    analyser0,      analyser1,      analyser2;      //Array of analysers


function drawSpectrogram(array, ctx, tempCtx, canvas, tempCanvas) {
    "use strict";
    // copy the current canvas onto the temp canvas
    tempCtx.drawImage(canvas, 0, 0, canvasWidth, canvasHeight);

    // iterate over the elements from the array
    for (var i = 0; i < array.length; i += 1) {
        // draw each pixel with the specific color
        var value = array[i];
        ctx.fillStyle = hot.getColor(value).hex();

        // draw the line at the right side of the canvas
        ctx.fillRect(canvasWidth - 1, canvasHeight - i, 1, 1);
    }

    // set translate on the canvas
    ctx.translate(-1, 0);
    // draw the copied image
    ctx.drawImage(tempCanvas, 0, 0, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
    // reset the transformation matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/**
* Generic function that is triggered on an audio process. It is called from one
* of three specific spectrogram onAudioProcess function, that pass in the
* appropriate variables.
*/
function audioProcess(source, analyser, ctx, tempCtx, canvas, tempCanvas, media) {
    //Create an array to hold the data from each analyser
    var binCount = analyser.frequencyBinCount;
    var array = new Uint8Array(binCount);
    analyser.getByteFrequencyData(array);
    // draw the spectrogram
    if (!media.paused) {
        drawSpectrogram(array, ctx, tempCtx, canvas, tempCanvas);
    }
}

/**
* Generic initializer for a single spectrogram. Links the filters with their
* analysers.
*/
function setupProcess(gainNode, analyser) {
    "use strict";
    analyser.smoothingTimeConstant = 0;
    analyser.fftSize = 1024;

    gainNode.connect(analyser);
}

//functions called by the javascript node
function audioProcess0() {
    "use strict";
    audioProcess(source0, analyser0, ctx0, tempCtx0, canvas0, tempCanvas0, media0);
}
function audioProcess1() {
    "use strict";
    audioProcess(source1, analyser1, ctx1, tempCtx1, canvas1, tempCanvas1, media1);
}
function audioProcess2() {
    "use strict";
    audioProcess(source2, analyser2, ctx2, tempCtx2, canvas2, tempCanvas2, media2);
}

/**
* Performs the initial setup of the spectrogram's analysis tools. Depends on
* canvasHeight, graphicQuality, spectroMax, spectroMin. Is called upon page
* load, and on a new graphicQuality
*/
function initializeVariables() {

    // connect to destination, else it isn't called
    javascriptNode0.connect(audioCtx.destination);
    javascriptNode1.connect(audioCtx.destination);
    javascriptNode2.connect(audioCtx.destination);


    // Generate a analyser for each segment of the filters
    analyser0 = audioCtx.createAnalyser();
    analyser1 = audioCtx.createAnalyser();
    analyser2 = audioCtx.createAnalyser();

    // initialize connections for spectrograms
    setupProcess(gainNode0,analyser0);
    setupProcess(gainNode1,analyser1);
    setupProcess(gainNode2,analyser2);

    // connect the audio signal to trigger audioProcess
    javascriptNode0.onaudioprocess = audioProcess0;
    javascriptNode1.onaudioprocess = audioProcess1;
    javascriptNode2.onaudioprocess = audioProcess2;
}

canvasHeight = 256;                 //Spectro Height
canvasWidth  = 400;                 //Spectro Width

// used for color distribution
hot = new chroma.ColorScale({
    colors: ['#000000', '#ff0000', '#ffff00', '#ffffff'],
    positions: [0, 0.25, 0.75, 1],
    mode: 'rgb',
    limits: [0, 300]
});

//pull the canvas into a variable
canvas0 = document.getElementById("canvas0");
canvas1 = document.getElementById("canvas1");
canvas2 = document.getElementById("canvas2");

// get the audioCtx from the canvas to draw on
ctx0 = $("#canvas0").get()[0].getContext("2d");
ctx1 = $("#canvas1").get()[0].getContext("2d");
ctx2 = $("#canvas2").get()[0].getContext("2d");

// create a temp canvas we use for copying
tempCanvas0 = document.createElement("canvas");
tempCanvas1 = document.createElement("canvas");
tempCanvas2 = document.createElement("canvas");

// create a temp context from the tempCanvas
tempCtx0 = tempCanvas0.getContext("2d");
tempCtx1 = tempCanvas1.getContext("2d");
tempCtx2 = tempCanvas2.getContext("2d");

// set the widths
tempCanvas0.width = canvasWidth;
tempCanvas1.width = canvasWidth;
tempCanvas2.width = canvasWidth;

// set the heights
tempCanvas0.height = canvasHeight;
tempCanvas1.height = canvasHeight;
tempCanvas2.height = canvasHeight;

// setup a javascript node [affects speed]
javascriptNode0 = audioCtx.createScriptProcessor(2048, 1, 1);
javascriptNode1 = audioCtx.createScriptProcessor(2048, 1, 1);
javascriptNode2 = audioCtx.createScriptProcessor(2048, 1, 1);

initializeVariables();

// connect spectrogram initial node to audio source
gainNode0.connect(javascriptNode0);
gainNode1.connect(javascriptNode1);
gainNode2.connect(javascriptNode2);
