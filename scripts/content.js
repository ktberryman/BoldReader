let bold = false;
let boldedNodes = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'on' && !bold) {
        boldText(document.body, 3);
        bold = true;
        sendResponse({ message: 'Bolded' });
    } else if (request.action === 'off') {
        location.reload();
        bold = false;
        sendResponse({ message: 'Unbolded' });
    } else if (request.action === 'bold') {
        updateBoldness(request.boldness);
        sendResponse({ message: 'Bolded ' });
    }
});

function boldText(node, boldness) {
    if (node.nodeType === Node.TEXT_NODE) {
        const words = node.nodeValue.split(/\b/);
        const boldText = words.map(word => {
            if (word.trim().length === 0) return word;
            return `<strong>${word.substring(0, boldness)}</strong>${word.substring(boldness)}`;
        });
        const span = document.createElement('span');
        span.innerHTML = boldText.join('');
        const newNode = node.parentNode.insertBefore(span, node);
        node.parentNode.removeChild(node);
        boldedNodes.push(newNode);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (const child of node.childNodes) {
            boldText(child, boldness);
        }
    }
}

function updateBoldness(boldness) {
  boldedNodes.forEach(node => {
      const textContent = node.textContent;
      const parent = node.parentNode;
      const words = textContent.split(/\b/);
      const boldText = words.map(word => {
          if (word.trim().length === 0) return word;
          return `<strong>${word.substring(0, boldness)}</strong>${word.substring(boldness)}`;
      });
      const span = document.createElement('span');
      span.innerHTML = boldText.join('');
      parent.replaceChild(span, node);
      boldedNodes = [span];
  });
}

function unboldText() {
    boldedNodes.forEach(node => {
        const textContent = node.textContent;
        const parent = node.parentNode;
        const newNode = document.createTextNode(textContent);
        parent.replaceChild(newNode, node);
    });
    boldedNodes = [];
}