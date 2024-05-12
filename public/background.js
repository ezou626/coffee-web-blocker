//TODO add context menu option to block hyperlink selected

//initialize settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({settings: {'default': true}});
  chrome.storage.local.set({lists: [
    {
      name: 'default',
      list: ['https://thedp.com']
    },
  ]});
  chrome.storage.local.set({active: [
  ]});
})

chrome.runtime.onInstalled.addListener((message, sender, sendResponse) => {
  if (message.action === 'getCurrentTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ tabUrl: tabs[0].url });
    });
  }
  return true;
});

chrome.runtime.onInstalled.addListener((message, sender, sendResponse) => {
  if (message.action === 'sayhello') {
    sendResponse({message: "back"});
  }
  return true;
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
  if (request.message == 'openSettingsPage') {
    chrome.tabs.create({
      active: true,
      url: 'page.html'
    }, null);
  }
});
