/*
{
  "credentials": [
    {
      "username": "agshruti",
      "password": "CIS3500"
    }
  ],
  "blockLists": [
    {
      "name": "Study Block",
      "items": ["netflix.com", "youtube.com"],
      "active": true    
    }
  ],
  "schedules": [
    {
      "name": "Weekday Blues",
      "blockSchedule": [
        {
          "dayOfWeek": "Monday",
          "startTime": "09:00",
          "endTime": "17:00"
        },
        {
          "dayOfWeek": "Tuesday",
          "startTime": "10:00",
          "endTime": "18:00"
        }
      ]
    }
  ]
}
*/

// Function to insert/update credentials in chrome.storage.local
function storeCredentials(username, password) {
  chrome.storage.sync.get("credentials", function (result) {
    let credentials = result.credentials || [];
    // Check if credentials for the given username already exist

    if (credentials != [] && credentials.username == username) {
      // Update existing credentials
      credentials.password = password;
    } else {
      // Insert new credentials
      credentials = { username: username, password: password };
    }
    chrome.storage.sync.set({ credentials: credentials }, function () {
      if (chrome.runtime.lastError) {
        console.error(
          "Error storing credentials: " + chrome.runtime.lastError.message
        );
      } else {
        console.log("Credentials stored successfully");
      }
    });
  });
}

// Function to insert/update block lists in chrome.storage.local
function storeBlockList(name, items, active) {
  chrome.storage.sync.get("blockLists", function (result) {
    let blockLists = result.blockLists || [];
    // Check if block list with the given name already exists
    let existingIndex = blockLists.findIndex((list) => list.name === name);
    if (existingIndex !== -1) {
      // Update existing block list
      blockLists[existingIndex].items = items;
      blockLists[existingIndex].active = active;
    } else {
      // Insert new block list
      blockLists.push({ name: name, items: items, active: active });
    }
    chrome.storage.sync.set({ blockLists: blockLists }, function () {
      if (chrome.runtime.lastError) {
        console.error(
          "Error storing block list: " + chrome.runtime.lastError.message
        );
      } else {
        console.log("Block list stored successfully");
      }
    });
  });
}

// Function to insert/update schedules in chrome.storage.local
function storeSchedule(name, blockSchedule) {
  chrome.storage.sync.get("schedules", function (result) {
    let schedules = result.schedules || [];
    // Check if schedule with the given name already exists
    let existingIndex = schedules.findIndex(
      (schedule) => schedule.name === name
    );
    if (existingIndex !== -1) {
      // Update existing schedule
      schedules[existingIndex].blockSchedule = blockSchedule;
    } else {
      // Insert new schedule
      schedules.push({ name: name, blockSchedule: blockSchedule });
    }
    chrome.storage.sync.set({ schedules: schedules }, function () {
      if (chrome.runtime.lastError) {
        console.error(
          "Error storing schedule: " + chrome.runtime.lastError.message
        );
      } else {
        console.log("Schedule stored successfully");
      }
    });
  });
}

// Example usage
storeCredentials("agshruti", "CIS3500");
storeBlockList("Study Block", ["netflix.com", "youtube.com"], true);
storeSchedule("Weekday Blues", [
  { dayOfWeek: "Monday", startTime: "09:00", endTime: "17:00" },
  { dayOfWeek: "Tuesday", startTime: "10:00", endTime: "18:00" },
]);
