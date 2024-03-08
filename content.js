chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'on') {
      /*
      document.documentElement.style.filter = 'blur(10px)';
      sendResponse({ message: 'Website is now totally unreadable.' });
      */
      
      bolded();
      sendResponse({ message: 'Bolded' });
    } else if (request.action === 'off') {
      document.documentElement.style.filter = 'none';
      sendResponse({ message: 'Webiste is readable again.' });
    }
  });

  function bolded() {
    const words = document.body.innerText.match(/\b[A-Za-z]+\b/g);
    if (words) {
      const boldText = words.map(word => {
        return `<strong>${word.substring(0, 3)}</strong>` + `${word.substring(3)}`;
      });
      const result = boldText.join(' ');
      document.body.innerHTML = result;
    }
  }
