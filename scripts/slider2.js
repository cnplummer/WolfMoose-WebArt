$(document).ready(function() {

    $(".slider2").slider({
        min: 0,
        max: 100,
        value: 0,
        orientation: "vertical",
        animate: "true",
        slide: function(event, ui) {
        setVolume(ui.value / 10);
        }
    });
    
    function setVolume(myGain) {
    gainNode1.gain.value = myGain;
    };

});


