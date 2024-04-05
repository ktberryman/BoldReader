chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "1",
    title: "Bold this",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "1" && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, { action: 'boldSelected' });
  }
});

