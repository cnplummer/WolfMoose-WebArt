$(document).ready(function() {

    $(".slider3").slider({
        min: 0,
        max: 100,
        value: 0,
        orientation: "vertical",
        animate: "true",
        slide: function(event, ui) {
        setVolume(ui.value / 12);
        }
    });
    
    function setVolume(myGain) {
    gainNode2.gain.value = myGain;
    };
});


