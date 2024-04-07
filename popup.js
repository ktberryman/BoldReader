document.addEventListener('DOMContentLoaded', function() {
  var sliderCheckbox = document.getElementById('slider-1');
  var slider2 = document.getElementById('slider-2');
  var boldnessSlider = document.getElementById('boldness-slider');
  var colorPicker = document.getElementById('colorpicker');

  // event listener for bold toggle
  sliderCheckbox.addEventListener('change', function() {
    if (this.checked) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'bold_on'} );
      });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'bold_off' } );
      });
    }
  });

  // event listener for preset 1 toggle
  slider2.addEventListener('change', function() {
    if (this.checked) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'preset_on'} );
      });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'preset_off' } );
      });
    }
  });

  // event listener for bold range slider
  boldnessSlider.addEventListener('input', function() {
    var boldnessValue = parseInt(this.value);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'bold', boldness: boldnessValue});
    });
  });

  // event listener for bold color selection
  colorPicker.addEventListener('change', function() {
    var selectedColor = colorPicker.value;
    console.log('Selected Color:', selectedColor);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'color', color: selectedColor});
      });
  });

});

