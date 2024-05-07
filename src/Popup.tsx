import * as React from 'react';
import { useState, useEffect } from 'react';
import { BlockList, BlockListMetadata, Link } from './api/BlockListAPI';
import BlockListList from './popup_components/BlockListList';
import BlockListUpdater from './popup_components/BlockListUpdater';
import { DB_NAME, DB_VERSION, BLOCKLIST_STORE } from './config';

// const generate_selected = (set: Set<number>) => {
//   const array = Array.from(set); 
//   return array.map((number) => <li key={number}>{number}</li>)
// }

const Popup: React.FC = () => {
  // Define the state variable for storing the list of blocklists
  const [lists, setLists] = useState<BlockListMetadata[]>([]);
  const [selectedLists, setSelectedLists] = useState(new Set<number>());

  // Use useEffect to load blocklists from local storage when the component mounts
  useEffect(() => {
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onsuccess = (event) => {
      const db: IDBDatabase = dbRequest.result;
      const blockListTransaction = db.transaction(BLOCKLIST_STORE, 'readonly');
      const blockListStore = blockListTransaction.objectStore(BLOCKLIST_STORE);
      const getListsRequest = blockListStore.getAll();
      getListsRequest.onsuccess = () => {
        const blockLists: BlockListMetadata[] = getListsRequest.result;
        setLists(blockLists);
      }
    }
  }, []);

  const newPage = () => {
    chrome.runtime.sendMessage({action: 'openSettingsPage'}, 
  (()=> {return;}));
  }

  return (
    <div className='min-w-full min-h-full flex-col flex items-center bg-tan text-brown space-y-5'>
      <h1 className="text-2xl p-2 font-bold">Coffee Web Blocker</h1>

      <BlockListList
        lists={lists}
        selectedLists={selectedLists}
        setSelectedLists={setSelectedLists}
      />
      
      <BlockListUpdater lists={lists} />

      <button onClick={newPage}>Advanced Settings</button>
    </div>
  );
}

export default Popup;