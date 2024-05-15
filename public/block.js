// allows tab to receive info about blocked tab
var pattern;

function handleUnblock() {
  chrome.runtime.sendMessage({
    action: 'unblock',
    pattern: pattern
  })
}

document.getElementById('unblock').addEventListener("click", handleUnblock);
if (!pattern || pattern === '') {
  document.getElementById('unblock').style.visibility = "hidden";
}

chrome.runtime.sendMessage({
  action: 'getTabInfo'
}, (response) => {
  document.getElementById('unblock').innerHTML = `Unblock ${response.matched} for now`;
  pattern = response.matched;
  document.getElementById('unblock').style.visibility = "";
})