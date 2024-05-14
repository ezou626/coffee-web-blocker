import * as React from 'react';
import { useState, useEffect } from 'react';
import { BlockListMetadata } from '../api/BlockListAPI';
import BlockListList from './BlockListList';
import BlockListUpdater from './BlockListUpdater';
import { DB_NAME, DB_VERSION, BLOCKLIST_STORE } from '../config';

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

  //Send a message to background script for updating 
  const updateBlockList = (newDomain: string) => {
    chrome.runtime.sendMessage({action: 'UPDATE_DOMAINS', data: newDomain}, response => {
      console.log('Response from background:', response);
    });
  }



  return (
    <div className='min-w-full min-h-full flex flex-col items-center justify-between'>
      <h1 className="text-2xl text-darkbrown font-bold mt-5">Coffee Web Blocker</h1>
      <div className="flex-col space-y-5">
        <BlockListList
          lists={lists}
          selectedLists={selectedLists}
          setSelectedLists={setSelectedLists}
        />
        <BlockListUpdater lists={lists} />
      </div>
      <button className='btn btn-primary text-white border-darkbrown bg-darkbrown max-w-xs mb-5 ' onClick={newPage}>Advanced Settings</button>
    </div>
  );
}

export default Popup;