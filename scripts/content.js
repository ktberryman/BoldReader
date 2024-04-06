let bold = false;
let boldedNodes = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.toggleId === 'slider-1') {
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
    } else if (request.toggleId === 'slider-2') {
        if (request.action === 'on') {
            presetFormat(document.body);
            sendResponse({ message: 'Slider-2 activated' });
        } else if (request.action === 'off') {
            location.reload();
            sendResponse({ message: 'Slider-2 deactivated' });
        }
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

function presetFormat(node) {
  // format specified by
  // https://www.bdadyslexia.org.uk/advice/employers/creating-a-dyslexia-friendly-workplace/dyslexia-friendly-style-guide#:~:text=Use%20sans%20serif%20fonts%2C%20such,may%20request%20a%20larger%20font.
  const presetStyles = {
    fontFamily: 'Arial, sans-serif', // Arial font
    fontSize: '16px', // 16-19px
    letterSpacing: '2.67px', // 35% letter spacing of 16 px approx 8px / 3 = 2.667 px
    wordSpacing: '9.345px', // word spacing 3.5 times the letter spacing ie. 2.667*3.5 = 9.345px
    lineHeight: '14px', // line spacing 150% word spacing
    fontWeight: 'bold',
    color: '#333333',
    textDecoration: 'none',
    textTransform: 'none'
  };

  const headerStyles = {
    fontSize: '20px', // 20% larger than the body text
    // Adjust proportionally
    letterSpacing: '3.2px',
    wordSpacing: '11.214px',
    lineHeight: '16.8px',
    fontWeight: 'bold'
  };

  const textNodes = getTextNodes(node);


  textNodes.forEach(node => {
    const span = document.createElement('span');
    Object.assign(span.style, presetStyles);
    // headers
    if (node.parentNode.tagName.match(/^H\d$/)) {
      Object.assign(span.style, headerStyles);
    }
    span.textContent = node.textContent;
    const parent = node.parentNode;
    parent.replaceChild(span, node);
    });
  }

  // Helper function to get all text nodes in a given node
  function getTextNodes(node) {
    const textNodes = [];
    function traverseNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
    } else {
      for (const child of node.childNodes) {
        traverseNodes(child);
      }
    }
    }
  traverseNodes(node);
  return textNodes;
  }

