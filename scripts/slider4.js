$(document).ready(function() {

    $(".slider4").slider({
        min: 0,
        max: 100,
        value: 0,
        orientation: "horizontal",
        animate: "true",
        slide: function(event, ui) {
        setGraphics(ui.value/20 + 1);
        }
    });
    
    function setGraphics(newQuality) {
    graphicQuality = newQuality;
    };
});

