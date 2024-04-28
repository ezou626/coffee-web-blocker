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

// detect open tab
chrome.tabs.onCreated.addListener((tab) => {

})
