import React, { useState, useEffect } from 'react';
import { BlockListMetadata, LinkResult } from './api/BlockListAPI';
import { DB_NAME, DB_VERSION, BLOCKLIST_STORE, LINK_STORE } from './config';

const AdvancedSettings: React.FC = () => {
  const [blockLists, setBlockLists] = useState<BlockListMetadata[]>([]);
  const [newBlockListName, setNewBlockListName] = useState<string>('');
  const [selectedBlockList, setSelectedBlockList] = useState<number | null>(null);
  const [newUrl, setNewUrl] = useState<string>('');
  const [renameBlockListName, setRenameBlockListName] = useState<string>('');
  const [urlsByBlockListId, setUrlsByBlockListId] = useState<{ [key: number]: { id: number, url: string }[] }>({});

  const loadBlockLists = async () => {
      const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
      dbRequest.onsuccess = (event) => {
          const db: IDBDatabase = dbRequest.result;
          const transaction = db.transaction(BLOCKLIST_STORE, 'readonly');
          const store = transaction.objectStore(BLOCKLIST_STORE);
          const request = store.getAll();
          request.onsuccess = async () => {
              setBlockLists(request.result);
              // Load URLs for each blocklist
              for (const blockList of request.result) {
                  await loadUrlsByBlockListId(blockList.id);
              }
          };
      };
  };

  useEffect(() => {
      loadBlockLists();
  }, []);

  async function loadUrlsByBlockListId(id: number): Promise<string[]> {
      const urlList: string[] = [];
      const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
      const p: Promise<string[]> = new Promise((resolve, reject) => {
          dbRequest.onsuccess = (event) => {
              const db: IDBDatabase = dbRequest.result;
              const linksTransaction = db.transaction(LINK_STORE, 'readonly');
              const linksStore = linksTransaction.objectStore(LINK_STORE);
              const index = linksStore.index('blockListIndex');
              const getLinksRequest = index.getAll(id);
              getLinksRequest.onsuccess = () => {
                  const links: LinkResult[] = getLinksRequest.result;
                  for (const link of links) {
                      urlList.push(link.url);
                  }
                  setUrlsByBlockListId(prevState => ({
                      ...prevState,
                      [id]: links.map(link => ({ id: link.id, url: link.url }))
                  }));
                  resolve(urlList);
              }

              getLinksRequest.onerror = () => {
                  resolve(urlList);
              }
          }
      });
      return p;
  }

  const handleAddBlockList = async () => {
      if (newBlockListName.trim() === '') return;
      const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
      dbRequest.onsuccess = async (event) => {
          const db = dbRequest.result;
          const transaction = db.transaction(BLOCKLIST_STORE, 'readwrite');
          const store = transaction.objectStore(BLOCKLIST_STORE);
          const request = store.add({ name: newBlockListName });
          request.onsuccess = () => {
              setNewBlockListName('');
              loadBlockLists(); // Reload blocklists from the database
          };
      };
  };

  const handleDeleteBlockList = (blockListId: number) => {
      const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
      dbRequest.onsuccess = (event) => {
          const db = dbRequest.result;
          const transaction = db.transaction(BLOCKLIST_STORE, 'readwrite');
          const store = transaction.objectStore(BLOCKLIST_STORE);
          const request = store.delete(blockListId);
          request.onsuccess = () => {
              loadBlockLists(); // Reload blocklists from the database
          };
      };
  };

  const handleRenameBlockList = (blockListId: number) => {
    if (renameBlockListName.trim() === '' || blockListId === null) return;

    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onsuccess = (event) => {
        const db = dbRequest.result;
        const transaction = db.transaction(BLOCKLIST_STORE, 'readwrite');
        const store = transaction.objectStore(BLOCKLIST_STORE);
        const getRequest = store.get(blockListId);

        getRequest.onsuccess = () => {
            const data = getRequest.result;
            data.name = renameBlockListName;
            const updateRequest = store.put(data);
            updateRequest.onsuccess = () => {
                setRenameBlockListName('');
                loadBlockLists(); // Reload blocklists from the database to reflect the update
            };
        };
    };
};  

const handleAddUrl = () => {
  if (newUrl.trim() === '' || selectedBlockList === null) return;
  const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onsuccess = (event) => {
      const db = dbRequest.result;
      const transaction = db.transaction(LINK_STORE, 'readwrite');
      const store = transaction.objectStore(LINK_STORE);
      const request = store.add({ blockListId: selectedBlockList, url: newUrl });
      request.onsuccess = () => {
          setNewUrl('');
          loadUrlsByBlockListId(selectedBlockList); // Reload URLs for this blocklist
      };
  };
};

const handleDeleteUrl = (urlId: number) => {
  const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onsuccess = (event) => {
      const db = dbRequest.result;
      const transaction = db.transaction(LINK_STORE, 'readwrite');
      const store = transaction.objectStore(LINK_STORE);
      const request = store.delete(urlId);
      request.onsuccess = () => {
          loadUrlsByBlockListId(selectedBlockList!); // Reload URLs for this blocklist
      };
  };
};

return (
  <div className="min-w-full min-h-screen flex flex-col items-center bg-cream p-4">
      <h1 className="text-3xl font-bold mb-8 text-brown mt-5">Advanced Settings</h1>
      <div className="w-full space-y-5">
          <div className="flex flex-col items-center">
              <input
                  type="text"
                  value={newBlockListName}
                  onChange={(e) => setNewBlockListName(e.target.value)}
                  placeholder="New Blocklist Name"
                  className="p-2 rounded-md text-cream bg-toast w-1/2"
              />
              <button onClick={handleAddBlockList} className="mt-2 p-2 bg-toast text-cream font-bold rounded-lg w-1/2">
                  Add Blocklist
              </button>
          </div>

          <div className="flex flex-col items-center">
              <select
                  onChange={(e) => setSelectedBlockList(parseInt(e.target.value))}
                  className="p-2 rounded-md text-cream bg-toast w-1/2"
              >
                  <option value="">Select Blocklist</option>
                  {blockLists.map(blockList => (
                      <option key={blockList.id} value={blockList.id}>
                          {blockList.name}
                      </option>
                  ))}
              </select>
              <input
                  type="text"
                  value={renameBlockListName}
                  onChange={(e) => setRenameBlockListName(e.target.value)}
                  placeholder="New Blocklist Name"
                  className="mt-2 p-2 rounded-md text-cream bg-toast w-1/2"
              />
              <button onClick={() => handleRenameBlockList(selectedBlockList!)}
                  className="mt-2 p-2 bg-toast text-cream font-bold rounded-lg w-1/2">
                  Rename Blocklist
              </button>
          </div>

          <div className="flex flex-col items-center">
              <select
                  onChange={(e) => setSelectedBlockList(parseInt(e.target.value))}
                  className="p-2 rounded-md text-cream bg-toast w-1/2"
              >
                <option value="">Select Blocklist</option>
                  {blockLists.map(blockList => (
                      <option key={blockList.id} value={blockList.id}>
                          {blockList.name}
                      </option>
                  ))}
              </select>
              <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="New URL"
                  className="mt-2 p-2 rounded-md text-cream bg-toast w-1/2"
              />
              <button onClick={() => handleAddUrl()}
                  className="mt-2 p-2 bg-toast text-cream font-bold rounded-lg w-1/2">
                  Add URL
              </button>
        </div>
      </div>

      <div className="w-full mt-5 space-y-5">
          {blockLists.map(blockList => (
              <div key={blockList.id} className="flex flex-col items-center w-full">
                  <h2 className="text-2xl text-brown">{blockList.name}</h2>
                  <ul className="w-full">
                      {urlsByBlockListId[blockList.id]?.map(url => (
                          <li key={url.id} className="flex justify-between items-center">
                              <span>{url.url}</span>
                              <button onClick={() => handleDeleteUrl(url.id)}
                                  className="text-red-500 hover:text-red-700">
                                  Delete
                              </button>
                          </li>
                      ))}
                  </ul>
                  <button onClick={() => handleDeleteBlockList(blockList.id)}
                      className="mt-2 p-2 bg-red-500 text-brown font-bold rounded-lg w-1/2">
                      Delete Blocklist
                  </button>
              </div>
          ))}
      </div>
  </div>
);
};

export default AdvancedSettings;