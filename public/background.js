//initialize settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({settings: {'default': true}});
  chrome.storage.local.set({active: []});

  const dbRequest = indexedDB.open('BlockListDB', 1);

  dbRequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    const blockListStore = db.createObjectStore('blockLists', { keyPath: 'id' });
    const linksStore = db.createObjectStore('links', { keyPath: ['blockListId', 'linkId'] });
    linksStore.createIndex('urlIndex', 'url', { unique: true });
  };

  // initialize a default list
  dbRequest.onsuccess = (event) => {
    const db = event.target.result;
    const blockListTransaction = db.transaction(['blockLists'], 'readwrite');
    const blockListStore = blockListTransaction.objectStore('blockLists');
    const newBlockList = { id: 1, name: 'My Block List' };
    blockListStore.add(newBlockList);
  }
})

// detect open tab
// chrome.tabs.onCreated.addListener((tab) => {

// })

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getCurrentTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ tabUrl: tabs[0].url });
    });
  }
  return true;
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action == 'openSettingsPage') {
    chrome.tabs.create({
      active: true,
      url: 'page.html'
    }, null);
  }
});
