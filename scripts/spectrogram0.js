

//Draws the spectrogram onto the canvas
function drawSpectrogram0(array) {
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
function audioProcess0() {
    "use strict";
    // get the average for the first channel
    var bin = analyserArray0[0].frequencyBinCount;
    console.log(bin);
    var array = new Uint8Array(bin);
    var sendArray = new Uint8Array(256);
    var j0 = 0;
    
    for(var j = 0; j < 256; j++){
        analyserArray0[j].getByteFrequencyData(array);
        var sum = 0;
        for(var k = 0; k < bin; k++){
            sum += Math.pow(10, array[k]/10) / 1000;
        }
        sum = sum / bin;
        sum = sum * 1000;
        sum = Math.log10(sum);
        sum = sum * 10;
        sendArray[j0] = sum;
        j0++;
    }
    
    //var array = new Uint8Array(analyser0.frequencyBinCount);
    //analyser0.getByteFrequencyData(array);

    // draw the spectrogram
    if (!source0.mediaElement.paused) {
        //console.log(document.getElementById("src1").paused);
        drawSpectrogram0(sendArray);
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


// Generating a data set for spectrogram from log.
var FilterArray0 = new Array(256);
var logStart0 = Math.log10(20);
var logEnd0 = Math.log10(20000);
//Generate 256 bins from a log range of 20-20000
var stepFunc0 = (logEnd0-logStart0) / 256;
var arrayNum0 = 0;
//Because of non-precise nature of the visualization, the loop will cycle
// through the bin's lower range.
for(var j = logStart0; j < logEnd0 + (stepFunc0/2); j+=stepFunc0){
    //Q = center_frequency / (top_frequency - bottom_frequency)
    var freqTop = Math.pow(10, (stepFunc0/2) + j);
    var freqCenter = Math.pow(10, (stepFunc0/4) + j);
    FilterArray0[arrayNum0] = audioCtx.createBiquadFilter();
    FilterArray0[arrayNum0].type = "bandpass";
    FilterArray0[arrayNum0].frequency.value = freqCenter;
    FilterArray0[arrayNum0].Q.value = freqCenter / (freqTop - Math.pow(10, j));
    console.log(FilterArray0[arrayNum0].Q.value);
    gainNode0.connect(FilterArray0[arrayNum0]);
    arrayNum0++;
}
//console.log(arrayNum0);

analyserArray0 = new Array(256);

for(var j = 0; j < 256; j++){
    analyserArray0[j] = audioCtx.createAnalyser();
    analyserArray0[j].fftSize = 32;
    FilterArray0[j].connect(analyserArray0[j]);
    //analyserArray0[j].connect(javascriptNode0);
}

// setup a analyzer
/*analyser0 = audioCtx.createAnalyser();
analyser0.smoothingTimeConstant = 0;
analyser0.fftSize = 256;*/
//analyser0.fftSize = 512;

// create a buffer source node
//gainNode0.connect(analyser0);
gainNode0.connect(javascriptNode0);


// when the javascript node is called
// we use information from the analyzer node
// to draw the volume
javascriptNode0.onaudioprocess = audioProcess0;