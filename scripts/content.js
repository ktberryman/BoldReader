let bold = false;
let spaced = false;
let recolored = false;
let preset_applied = false;
let boldedNodes = [];
let currentBoldness = 3;
let currentColor = '#000000'

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'bold_on') {
        checkpreset();
        boldText(document.body, currentBoldness);
        bold = true;
        sendResponse({ message: 'Bold on' });
    } else if (request.action === 'bold_off') {
        bold = false;
        statecheck(document.body);
        sendResponse({ message: 'Bold off' });
    } else if (request.action=== 'spaced_on') {
        checkpreset();
        spaceText(document.body)
        spaced = true;
        sendResponse({ message: 'Space on'})
    } else if (request.action=== 'spaced_off'){
        spaced = false;
        unspaceText(document.body);
        sendResponse({ message: 'Space off'})
    }else if (request.action === 'custom_on') {
        if (spaced) {
            spaceText(document.body);
        }
        if (bold) {
            boldText(document.body, currentBoldness);
        }
        if (recolored) {
            updateColor(request.color);
        }
        checkpreset();
        sendResponse({ message: 'custom applied' });
    } else if (request.action === 'custom_off') {
        location.reload();
        sendResponse({ message: 'custom removed' });
    }else if (request.action === 'preset_on') {
        chrome.runtime.sendMessage({ action: 'custom_off' }, function(response) {
        console.log(response.message);
    });
        presetFormat(document.body);
        //managing states
        preset_applied = true;
        bold = false;
        recolored = false;
        spaced = false;
        sendResponse({ message: 'preset 1 applied' });
    } else if (request.action === 'preset_off') {
        removePresetFormat(document.body);
        preset_applied = false;
        sendResponse({ message: 'preset 1 removed' });
    } else if (request.action === 'bold') {
        checkpreset();
        updateBoldness(request.boldness);
        sendResponse({ message: 'Bolded ' });
    } else if (request.action === 'color') {
        recolored = true;
        checkpreset();
        updateColor(request.color);
        sendResponse({ message: 'Set color'})
    } else if (request.action === 'boldSelected') {
        checkpreset();
        boldSelected();
        bold = true;
        sendResponse({message: 'Bolded selection'})
    }  else if (request.action === 'unboldSelected') {
        checkpreset();
        unboldSelected();
        bold = false;
        sendResponse({message: 'Unbolded selection'})
    }
});
//preset check
function checkpreset(){
    if (preset_applied){
        removePresetFormat(document.body)
    }
}
// bold functionality
function boldText(node, boldness) {
    if (node.nodeType === Node.TEXT_NODE) {
        const words = node.nodeValue.split(/\b/);
        const boldText = words.map(word => {
            if (word.trim().length === 0) return word;
            if(recolored) {
                return `<strong style="color: ${currentColor};">${word.substring(0, boldness)}</strong>${word.substring(boldness)}`;
            } else{
                return `<strong>${word.substring(0, boldness)}</strong>${word.substring(boldness)}`;
            }
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

// bold toggle off
function unboldText() {
    boldedNodes.forEach(node => {
        const textContent = node.textContent;
        const parent = node.parentNode;
        const newNode = document.createTextNode(textContent);
        parent.replaceChild(newNode, node);
    });
    boldedNodes = [];
    
    if (spaced) {
        spaceText(document.body);
    }
}
function statecheck() {
    if (!bold) {
        unboldText();
    } else {
        boldText(document.body, boldness);
    }
    if (!spaced){
        unspaceText(document.body)
    }else{
        spaceText(document.body)
    }
}
// Function to remove spacing changes
function unspaceText(node) {
    const spans = node.querySelectorAll('span.space-text');
    spans.forEach(span => {
        const textContent = span.textContent;
        const parent = span.parentNode;
        const newNode = document.createTextNode(textContent);
        parent.replaceChild(newNode, span);
    });
}
// function to add spacing
function spaceText(node){
    const presetStyles = {
        letterSpacing: '2.67px',
        lineHeight: '14px',
    };
    const headerStyles = {
        letterSpacing: '3.2px',
        wordSpacing: '11.214px',
        lineHeight: '16.8px',
    };
    const textNodes = getTextNodes(node);
    textNodes.forEach(node => {
      const span = document.createElement('span');
      span.classList.add('space-text');
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

// range slider
function updateBoldness(boldness) {
    currentBoldness = boldness;
    if (!bold){
        bold = true;
    }
    boldedNodes.forEach(node => {
        const words = node.textContent.split(/\b/);
        const boldText = words.map(word => {
            if (word.trim().length === 0) return word;
            if(recolored) {
                return `<strong style="color: ${currentColor};">${word.substring(0, boldness)}</strong>${word.substring(boldness)}`;
            } else{
                return `<strong>${word.substring(0, boldness)}</strong>${word.substring(boldness)}`;
            }
        });
        node.innerHTML = boldText.join('');
    });
    if (spaced){
        spaceText(document.body);
    }
}

// color selection
function updateColor(color) {
    currentColor = color;
    boldedNodes.forEach(node => {
        const parent = node.parentNode;
        const boldElements = node.querySelectorAll('strong');
        boldElements.forEach(boldElement => {
            boldElement.style.color = color;
        });
    });
}

// bold selection
function boldSelected() {
    const selectedText = window.getSelection().toString();
    const range = window.getSelection().getRangeAt(0);
    const words = selectedText.split(/\b/);
    const boldText = words.map(word => {
      if (word.trim().length === 0) return word;
      return `<strong>${word.substring(0, 3)}</strong>${word.substring(3)}`;
    });
    const span = document.createElement('span');
    span.innerHTML = boldText.join('');
    range.deleteContents();
    range.insertNode(span);
}

// unbold selection
function unboldSelected() {
    const selectedText = window.getSelection().toString();
    const range = window.getSelection().getRangeAt(0);
    const span = document.createElement('span');
    span.textContent = selectedText;
    range.deleteContents();
    range.insertNode(span);
}

// function for preset 1
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
    //marks things with a class 'data-preset' so that it knows what to remove in order to undo
    span.classList.add('data-preset');
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
  // helper function for preset
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
//removes any preset
function removePresetFormat(node) {
    const presetSpans = node.querySelectorAll('span.data-preset');
    presetSpans.forEach(span => {
        const textNode = document.createTextNode(span.textContent);
        span.parentNode.replaceChild(textNode, span);
    });
}