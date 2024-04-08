document.addEventListener('DOMContentLoaded', function() {
  var bold_toggle = document.getElementById('bold_toggle');
  var space_toggle = document.getElementById('space_toggle');
  var sliderCheckbox = document.getElementById('slider-1');
  var slider2 = document.getElementById('slider-2');
  var boldnessSlider = document.getElementById('boldness-slider');
  var colorPicker = document.getElementById('colorpicker');

  // event listener for bold setting toggle
  bold_toggle.addEventListener('change', function() {
    if (this.checked) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'bold_on'} );
        sliderCheckbox.checked = true;
      });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'bold_off' } );
      });
    }
  });
    // event listener for spacing toggle
    space_toggle.addEventListener('change', function() {
      if (this.checked) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'spaced_on'} );
          sliderCheckbox.checked = true;
        });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'spaced_off' } );
        });
      }
    });
      // event listener for custom toggle
  sliderCheckbox.addEventListener('change', function() {
    if (this.checked) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        slider2.checked = false;
        chrome.tabs.sendMessage(tabs[0].id, { action: 'custom_on'} );
      });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'custom_off' } );
        bold_toggle.checked = false;
        space_toggle.checked = false;
        boldnessSlider.value = 3; 
        colorPicker.value = "#000000";
      });
    }
  });

  // event listener for preset 1 toggle
  slider2.addEventListener('change', function() {
    if (this.checked) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        sliderCheckbox.checked = false;
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
    sliderCheckbox.checked = true;
    var boldnessValue = parseInt(this.value);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'bold', boldness: boldnessValue});
    });
  });

  // event listener for bold color selection
  colorPicker.addEventListener('change', function() {
    sliderCheckbox.checked = true;
    var selectedColor = colorPicker.value;
    console.log('Selected Color:', selectedColor);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'color', color: selectedColor});
      });
  });

});

