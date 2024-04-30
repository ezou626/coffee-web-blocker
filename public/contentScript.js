// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'getCurrentTab') {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       sendResponse({ tabUrl: tabs[0].url });
//     });
//   }
//   return true;
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'sayhello') {
//     sendResponse({message: "Hello World!"});
//   }
// });