// Adding URL to block list
const handleUrlAdd = (blockListId, url) => {
  const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onsuccess = (event) => {
    const db = dbRequest.result;
    const linkTransaction = db.transaction(LINK_STORE, "readwrite");
    const linkStore = linkTransaction.objectStore(LINK_STORE);
    linkStore.add({ blockListId: blockListId, url: url });
  };
};

// Removing URL by URL ID
const handleURLRemoveById = (urlId) => {
  const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onsuccess = (event) => {
    const db = dbRequest.result;
    const linkTransaction = db.transaction(LINK_STORE, "readwrite");
    const linkStore = linkTransaction.objectStore(LINK_STORE);
    const deleteRequest = linkStore.delete(urlId);
    deleteRequest.onsuccess = (event) => {
      console.log("URL deleted successfully");
    };
    deleteRequest.onerror = (event) => {
      console.error("Error deleting URL");
    };
  };
};

// Removing URL by blockListId and URL
const handleURLRemove = (blockListId, url) => {
  const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onsuccess = (event) => {
    const db = dbRequest.result;
    const linkTransaction = db.transaction(LINK_STORE, "readwrite");
    const linkStore = linkTransaction.objectStore(LINK_STORE);

    const urlIndex = linkStore.index("url");
    const cursorRequest = urlIndex.openCursor(IDBKeyRange.only(url));
    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value.blockListId === blockListId) {
          const deleteRequest = linkStore.delete(cursor.value.id);
          deleteRequest.onsuccess = (event) => {
            console.log("URL deleted successfully");
          };
          deleteRequest.onerror = (event) => {
            console.error("Error deleting URL");
          };
        } else {
          cursor.continue();
        }
      } else {
        console.log("URL not found");
      }
    };

    cursorRequest.onerror = (event) => {
      console.error("Error deleting URL");
    };
  };
};

// Adding block list
const handleBlockListAdd = (blockListName) => {
  const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onsuccess = (event) => {
    const db = dbRequest.result;
    const blockListTransaction = db.transaction(BLOCKLIST_STORE, "readwrite");
    const blockListStore = blockListTransaction.objectStore(BLOCKLIST_STORE);
    blockListStore.add({ name: blockListName });
  };
};

// Removing block list by blockListId
const handleBlockListRemove = (blockListId) => {
  const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onsuccess = (event) => {
    const db = dbRequest.result;
    const blockListTransaction = db.transaction(BLOCKLIST_STORE, "readwrite");
    const blockListStore = blockListTransaction.objectStore(BLOCKLIST_STORE);
    const deleteRequest = blockListStore.delete(blockListId);
    deleteRequest.onsuccess = (event) => {
      console.log("Block list deleted successfully");
    };
    deleteRequest.onerror = (event) => {
      console.error("Error deleting block list");
    };
  };
};

// Renaming block list by blockListId
const handleRenameBlockLists = (oldBlockListId, blockListName) => {
  const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onsuccess = (event) => {
    const db = dbRequest.result;
    const blockListTransaction = db.transaction(BLOCKLIST_STORE, "readwrite");
    const blockListStore = blockListTransaction.objectStore(BLOCKLIST_STORE);
    const blockList = blockListStore.get(oldBlockListId);
    blockList.name = blockListName;
    const requestUpdate = blockListStore.put(blockList);
    requestUpdate.onsuccess = () => {
      console.log("Block list renamed successfully");
    };
    requestUpdate.onerror = () => {
      console.error("Error renaming block list");
    };
  };
};

//export these functions

var settings_routes = {
  handleUrlAdd,
  handleURLRemoveById,
  handleURLRemove,
  handleBlockListAdd,
  handleBlockListRemove,
  handleRenameBlockLists,
};

export default settings_routes;
