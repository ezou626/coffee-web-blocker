//import backend_endpoints.js

function handleSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the value from the input field
  const inputValue = document.getElementById("textInput").value;
  const creds = {
    username: inputValue,
    password: "cis3500",
  };
  chrome.storage.sync.set({ credentials: creds }).then(() => {
    console.log("Value is set");
  });
}

function readCreds(event) {
  event.preventDefault(); // Prevent the default form submission
  chrome.storage.sync.get("credentials").then((result) => {
    console.log(result.credentials);
  });
}

function readLists(event) {
  event.preventDefault(); // Prevent the default form submission
  chrome.storage.sync.get("blockLists").then((result) => {
    console.log(result.blockLists);
  });
}

function readSceds(event) {
  event.preventDefault(); // Prevent the default form submission
  chrome.storage.sync.get("schedules").then((result) => {
    console.log(result.schedules);
  });
}

// Add event listener to the form
document.getElementById("myForm").addEventListener("submit", handleSubmit);
document.getElementById("submitCreds").addEventListener("click", readCreds);
document.getElementById("submitList").addEventListener("click", readLists);
document.getElementById("submitSced").addEventListener("click", readSceds);
