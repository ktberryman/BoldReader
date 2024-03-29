document.addEventListener('DOMContentLoaded', function() {
  var sliderCheckbox = document.getElementById('slider-1');

  sliderCheckbox.addEventListener('change', function() {
    if (this.checked) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'on' });
      });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'off' });
      });
    }
  });
});