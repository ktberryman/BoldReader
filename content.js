chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'on') {
      document.documentElement.style.filter = 'blur(10px)';
      sendResponse({ message: 'Website is now totally unreadable.' });
    } else if (request.action === 'off') {
      document.documentElement.style.filter = 'none';
      sendResponse({ message: 'Webiste is readable again.' });
    }
  });