const DB_NAME = 'BlockListDB';
const DB_VERSION = 1; // only integers
const BLOCKLIST_STORE = 'blockLists';
const LINK_STORE = 'links';

const websitesToBlock = [
  "reddit",
  "netflix",
  "youtube.com/shorts"
];

//initialize db, active lists, and settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({settings: {'default': true}});
  chrome.storage.local.set({active: []});

  const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);

  dbRequest.onupgradeneeded = (event) => {
    console.log("Refreshing list");
    const db = event.target.result;
    const blockListStore = db.createObjectStore(BLOCKLIST_STORE, { keyPath: 'id', autoIncrement: true });
    const linksStore = db.createObjectStore(LINK_STORE, { keyPath: 'id', autoIncrement: true });
    linksStore.createIndex('urlIndex', 'url', { unique: false });
    linksStore.createIndex('blockList', 'blockListId', { unique: false });
  };

  // initialize a default list
  dbRequest.onsuccess = (event) => {
    //consider adding error handling here

    const db = event.target.result;
    const blockListTransaction = db.transaction([BLOCKLIST_STORE], 'readwrite');
    const blockListStore = blockListTransaction.objectStore(BLOCKLIST_STORE);
    const newBlockList = { name: 'My Block List' };
    blockListStore.add(newBlockList);
    
    const linkTransaction = db.transaction([LINK_STORE], 'readwrite');
    const linkStore = linkTransaction.objectStore(LINK_STORE);
    const newLink = {blockListId: 1, url: "https://youtube.com"};
    linkStore.add(newLink);
  };

  dbRequest.onerror = (event) => {
    console.log("IndexedDB failed! Please reload and try again!");
  };
});

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
  };
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url && changeInfo.url !== chrome.runtime.getURL('block.html')) {
    for (const domain of websitesToBlock) {
      if (changeInfo.url.includes(domain)) {
        chrome.tabs.update(tabId, {
          url: chrome.runtime.getURL('block.html')
        });
      }
    }
  }
});