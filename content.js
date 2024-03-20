let bold = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'on' && !bold) {
      bolded(document.body);
      bold = true;
      sendResponse({ message: 'Bolded' });
    } else if (request.action === 'off') {
      bold = false;
      location.reload();
      sendResponse({ message: 'Unbolded' });
    }
  });

function bolded(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const words = node.nodeValue.split(/\b/);
    const boldText = words.map(word => {
      return `<strong>${word.substring(0, 3)}</strong>` + `${word.substring(3)}`;
    });
  
    const span = document.createElement('span');
    span.innerHTML = boldText.join('');
    node.replaceWith(span);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (const child of node.childNodes) {
      bolded(child);
    }
  }
}