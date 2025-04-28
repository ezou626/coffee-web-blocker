// allows tab to receive info about blocked tab
var pattern;

function handleUnblock() {
  chrome.runtime.sendMessage({
    action: 'unblock',
    pattern: pattern
  })
}

// Initially hide the unblock button until we get the pattern
document.getElementById('unblock').style.visibility = "hidden";
document.getElementById('unblock').addEventListener("click", handleUnblock);

// Get the pattern from the background script
chrome.runtime.sendMessage({
  action: 'getTabInfo'
}, (response) => {
  // Check if response exists before using it
  if (response && response.matched) {
    pattern = response.matched;
    
    if (pattern && pattern !== '') {
      document.getElementById('unblock').innerHTML = `Unblock ${pattern} for now`;
      document.getElementById('unblock').style.visibility = "visible";
    }
  } else {
    console.log("Invalid response received:", response);
    // Try again after a short delay
    setTimeout(() => {
      chrome.runtime.sendMessage({
        action: 'getTabInfo'
      }, (retryResponse) => {
        if (retryResponse && retryResponse.matched) {
          pattern = retryResponse.matched;
          if (pattern && pattern !== '') {
            document.getElementById('unblock').innerHTML = `Unblock ${pattern} for now`;
            document.getElementById('unblock').style.visibility = "visible";
          }
        } else {
          console.log("Retry failed, still no valid response");
        }
      });
    }, 500);
  }
});