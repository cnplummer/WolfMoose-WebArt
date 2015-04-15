/**
 * Sets up the spectrograms.
 *
 * @author Matthew Vaught
 *         mtvaught@mtu.edu
 */

var spectroMax,     //Max frequency of spectrogram
    spectroMin,     //Min frequency of spectrogram
    stepFunc,       //Used to determine the log steps between max and min
    canvasHeight,   //Height of graphics canvas
    canvasWidth,    //Width of graphics canvas
    graphicQuality, //Number of pixels per analysis
    canvas0,        canvas1,        canvas2,        //Canvas to draw on
    ctx0,           ctx1,           ctx2,           //Context from canvas
    tempCanvas0,    tempCanvas1,    tempCanvas2,    //Temp canvas to generate
    tempCtx0,       tempCtx1,       tempCtx2,       //Context from temp canvas
    javascriptNode0,javascriptNode1,javascriptNode2,//Triggers actions on audio
    FilterArray0,   FilterArray1,   FilterArray2,   //Array of biquad filters
    analyserArray0, analyserArray1, analyserArray2; //Array of analysers


function drawSpectrogram(array, ctx, tempCtx, canvas, tempCanvas) {
    "use strict";
    // copy the current canvas onto the temp canvas
    tempCtx.drawImage(canvas, 0, 0, 400, canvasHeight);

    // iterate over the elements from the array
    for (var i = 0; i < array.length; i += 1) {
        // draw each pixel with the specific color
        var value = array[i];
        ctx.fillStyle = hot.getColor(value).hex();

        // draw the line at the right side of the canvas
        ctx.fillRect(400 - 1, canvasHeight - i, 1, 1);
    }

    // set translate on the canvas
    ctx.translate(-1, 0);
    // draw the copied image
    ctx.drawImage(tempCanvas, 0, 0, 400, canvasHeight, 0, 0, 400, canvasHeight);
    // reset the transformation matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function audioProcess(source, analyserArray, ctx, tempCtx, canvas, tempCanvas) {
    var bin = analyserArray[0].frequencyBinCount;
    var array = new Uint8Array(bin);
    var sendArray = new Uint8Array(canvasHeight);
    var j0 = 0;
    for(var j = 0; j < canvasHeight; j++){
        var jj = Math.floor(j/graphicQuality);
        if ( jj >= arraySize ) jj = arraySize - 1;
        analyserArray[jj].getByteFrequencyData(array);
        var sum = 0;
        for(var k = 0; k < bin; k++){
            sum += Math.pow(10, array[k]/10) / 1000;
        }
        sendArray[j0] = Math.log10(sum / bin * 1000) * 10;
        j0++;
    }
    // draw the spectrogram
    if (!source.paused) {
        drawSpectrogram(sendArray, ctx, tempCtx, canvas, tempCanvas);
    }
}

function setupProcess(FilterArray, gainNode, analyserArray) {
    "use strict";
    var arrayNum = 0;
    //Because of non-precise nature of the visualization, the loop will cycle
    // through the bin's lower range.
    for(var j = spectroMin; j < spectroMax + (stepFunc/2); j+=stepFunc){
        //Q = center_frequency / (top_frequency - bottom_frequency)
        var freqTop = Math.pow(10, (stepFunc/2) + j);
        var freqCenter = Math.pow(10, (stepFunc/4) + j);
        FilterArray[arrayNum] = audioCtx.createBiquadFilter();
        FilterArray[arrayNum].type = "bandpass";
        FilterArray[arrayNum].frequency.value = freqCenter;
        FilterArray[arrayNum].Q.value = freqCenter / (freqTop - Math.pow(10, j));
        gainNode.connect(FilterArray[arrayNum]);
        arrayNum++;
    }

    for(var j = 0; j < arraySize; j++){
        analyserArray[j] = audioCtx.createAnalyser();
        analyserArray[j].fftSize = 32;
        FilterArray[j].connect(analyserArray[j]);
    }
}

//function called by the javascript node
function audioProcess0() {
    "use strict";
    audioProcess(source0, analyserArray0, ctx0, tempCtx0, canvas0, tempCanvas0);
}
function audioProcess1() {
    "use strict";
    audioProcess(source1, analyserArray1, ctx1, tempCtx1, canvas1, tempCanvas1);
}
function audioProcess2() {
    "use strict";
    audioProcess(source2, analyserArray2, ctx2, tempCtx2, canvas2, tempCanvas2);
}

function setGraphicQuality ( pixelsPerData ) {
    graphicQuality = pixelsPerData;
    location.reload();
}

//Explicit Defined Vars
spectroMax   = Math.log10(20000);   //Max frequency
spectroMin   = Math.log10(20);      //Min frequency
canvasHeight = 256;                 //Spectro Height
canvasWidth  = 400;                 //Spectro Width
graphicQuality = 5;
arraySize = Math.floor(canvasHeight / graphicQuality);
stepFunc = (spectroMax-spectroMin) / (arraySize);

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

// connect to destination, else it isn't called
javascriptNode0.connect(audioCtx.destination);
javascriptNode1.connect(audioCtx.destination);
javascriptNode2.connect(audioCtx.destination);

// Generating a data set for spectrogram from log.
FilterArray0 = new Array(arraySize);
FilterArray1 = new Array(arraySize);
FilterArray2 = new Array(arraySize);

// Generate a analyser for each segment of the filters
analyserArray0 = new Array(arraySize);
analyserArray1 = new Array(arraySize);
analyserArray2 = new Array(arraySize);

// initialize connections for spectrograms
setupProcess(FilterArray0,gainNode0,analyserArray0);
setupProcess(FilterArray1,gainNode1,analyserArray1);
setupProcess(FilterArray2,gainNode2,analyserArray2);

// connect spectrogram initial node to audio source
gainNode0.connect(javascriptNode0);
gainNode1.connect(javascriptNode1);
gainNode2.connect(javascriptNode2);

// connect the audio signal to trigger audioProcess
javascriptNode0.onaudioprocess = audioProcess0;
javascriptNode1.onaudioprocess = audioProcess1;
javascriptNode2.onaudioprocess = audioProcess2;
