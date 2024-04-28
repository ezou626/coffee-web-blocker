chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === null) {
    return false;
  }

  if (message.action === 'getCurrentTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ tab: tabs[0] });
    });
    return true; // Indicates async response
  }
});