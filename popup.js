document.addEventListener('DOMContentLoaded', function() {
    var convertButton = document.getElementById('onButton');
    var resetButton = document.getElementById('offButton');

    convertButton.addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'on' });
      });
    });

    resetButton.addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'off' });
      });
    });
  });