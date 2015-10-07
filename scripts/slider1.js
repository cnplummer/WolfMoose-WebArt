$(document).ready(function() {
    $(".slider1").slider({
        min: 0,
        max: 100,
        value: 0,
        animate: "true",
        orientation: "horizontal",
        slide: function(event, ui) {
        setVolume(ui.value / 12);
        }
    });
    function setVolume(myGain) {
    gainNode0.gain.value = myGain;
    };
});
