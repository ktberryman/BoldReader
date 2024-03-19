chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'on') {
      bolded();
    } else if (request.action === 'off') {
      location.reload();
    }
  });

//new
  function bolded() {
    const article = document.querySelector("article");
    if (article) {
      const words = article.innerText.match(/\b[A-Za-z]+\b/g);
      if (words) {
        const boldText = words.map(word => {
          return `<strong>${word.substring(0, 3)}</strong>` + `${word.substring(3)}`;
        });
        const result = boldText.join(' ');
        article.innerHTML = result;
      }
    }
  }