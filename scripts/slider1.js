$(document).ready(function() {

    $(".slider1").slider({
        min: 0,
        max: 100,
        value: 0,
        orientation: "vertical",
        animate: "true",
        slide: function(event, ui) {
        setVolume(ui.value / 100);
        }
    });
    
    function setVolume(myGain) {
    gainNode0.gain.value = myGain;
    };
});


