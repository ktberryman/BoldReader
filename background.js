chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "1",
    title: "Bold this",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "2",
    title: "Unbold this",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "1" && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, { action: 'boldSelected' });
  } else if (info.menuItemId === "2" && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, { action: 'unboldSelected' });
  }
});

