$(document).ready(function() {

    $(".slider4").slider({
        min: 1,
        max: 4,
        value: 0,
        orientation: "horizontal",
        animate: "true",
        slide: function(event, ui) {
        setGraphics(ui.value/20 + 1);
        }
    });
});

