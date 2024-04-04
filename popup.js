document.addEventListener('DOMContentLoaded', function() {
  var sliderCheckbox = document.getElementById('slider-1');
  var slider2 = document.getElementById('slider-2'); //added this
  var boldnessSlider = document.getElementById('boldness-slider');
  var colorPicker = document.getElementById('colorpicker');

    function colorChange(event) {
        const selectedColor = event.target.value;
        console.log('Selected Color:', selectedColor);
    }
  
  colorPicker.addEventListener('change', colorChange);

  function toggleSlider(slider, toggleId) {
    slider.addEventListener('change', function() {
      var message = { toggleId: toggleId };
      if (this.checked) {
        message.action = 'on';
      } else {
        message.action = 'off';
      }
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      });
    });
  }

  boldnessSlider.addEventListener('input', function() {
    var boldnessValue = parseInt(this.value);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'bold', boldness: boldnessValue});
    });
  });


  toggleSlider(sliderCheckbox, 'slider-1');

  toggleSlider(slider2, 'slider-2');

});