function Spectrogram (){
        //pull the canvas into a variable
    console.log("stuff");
    this.canvas = document.getElementById("canvas");

    // get the audioCtx from the canvas to draw on
    this.ctx = $("#canvas").get()[0].getContext("2d");

    // create a temp canvas we use for copying
    this.tempCanvas = document.createElement("canvas");
    this.tempCtx = this.tempCanvas.getContext("2d");
    this.tempCanvas.width = 400;
    this.tempCanvas.height = 256;

    // used for color distribution
    this.hot = new chroma.ColorScale({
        colors: ['#000000', '#ff0000', '#ffff00', '#ffffff'],
        positions: [0, 0.25, 0.75, 1],
        mode: 'rgb',
        limits: [0, 300]
    });

    // setup a javascript node [affects speed]
    this.javascriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
    // connect to destination, else it isn't called
    this.javascriptNode.connect(audioCtx.destination);

    // setup a analyzer
    this.analyser = audioCtx.createAnalyser();
    this.analyser.smoothingTimeConstant = 0;
    this.analyser.fftSize = 512;

    // create a buffer source node
    gainNode.connect(this.analyser);
    this.analyser.connect(this.javascriptNode);
    console.log(this.analyser);

    // when the javascript node is called
    // we use information from the analyzer node
    // to draw the volume
    
    this.thingy = function(analyser) {
        "use strict";
        // get the average for the first channel
        console.log(analyser);
        var array = new Uint8Array(analyser.frequencyBinCount);
        console.log(analyser);
        
        analyser.getByteFrequencyData(array);
        console.log("doingstuff");
        // draw the spectrogram
        if (!source.mediaElement.paused) {
            console.log("stilldoingstuff");
            //console.log(document.getElementById("src1").paused);
            this.drawSpectrogram(array);
        }
    };
    
    this.javascriptNode.onaudioprocess = this.thingy(this.analyser);


    //Draws the spectrogram onto the canvas
    this.drawSpectrogram = function(array) {
        "use strict";
        // copy the current canvas onto the temp canvas
        this.tempCtx.drawImage(canvas, 0, 0, 400, 256);

        // iterate over the elements from the array
        for (i = 0; i < array.length; i += 1) {
            // draw each pixel with the specific color
            value = array[i];
            this.ctx.fillStyle = this.hot.getColor(value).hex();

            // draw the line at the right side of the canvas
            this.ctx.fillRect(400 - 1, 256 - i, 1, 1);
        }

        // set translate on the canvas
        this.ctx.translate(-1, 0);
        // draw the copied image
        this.ctx.drawImage(this.tempCanvas, 0, 0, 400, 256, 0, 0, 400, 256);
        // reset the transformation matrix
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    //function called by the javascript node
   
}
