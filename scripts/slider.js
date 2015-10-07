$(document).ready(function() {
    $(".slider1").slider({
        min: 0,
        max: 100,
        value: 0,
        animate: "true",
        orientation: "horizontal",
        slide: function(event, ui) {
        setVolume(gainNode0, ui.value / 20);
        }
    });
    $(".slider2").slider({
        min: 0,
        max: 100,
        value: 0,
        orientation: "horizontal",
        animate: "true",
        slide: function(event, ui) {
        setVolume(gainNode1, ui.value / 10);
        }
    });
    $(".slider3").slider({
        min: 0,
        max: 100,
        value: 0,
        orientation: "horizontal",
        animate: "true",
        slide: function(event, ui) {
        setVolume(gainNode2, ui.value / 12);
        }
    });
    function setVolume(node, myGain) {
    node.gain.value = myGain;
    };
});

function sliderStart() {
  setTimeout(function() {
      $(".slider1").slider("value", 20);
      gainNode0.gain.value = 1;
      $(".slider2").slider("value", 20);
      gainNode1.gain.value = 2;
      $(".slider3").slider("value", 24);
      gainNode2.gain.value = 2;
  }, 2000);
}
