import * as React from 'react';
import { useState, useEffect } from 'react';
import { BlockListMetadata } from '../api/BlockListAPI';
import BlockListList from './BlockListList';
import BlockListUpdater from './BlockListUpdater';
import { DB_NAME, DB_VERSION, BLOCKLIST_STORE } from '../config';
import { Settings, Coffee } from 'lucide-react';

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
    <div className="w-100 min-h-[400px] bg-base-100 flex flex-col">
      <div className="navbar flex bg-darkbrown text-white gap-2 center justify-center items-center min-w-full">
        <Coffee size={24} />
        <h1 className="text-xl font-bold">Coffee Web Blocker</h1>
      </div>
      
      <div className="flex-1 overflow-auto p-4 flex flex-col items-center">
        <div className="w-full max-w-md space-y-6">
          <BlockListList
            lists={lists}
            selectedLists={selectedLists}
            setSelectedLists={setSelectedLists}
          />
          <BlockListUpdater lists={lists} />
        </div>
      </div>
      
      <div className="p-4 border-base-200">
        <button 
          className="btn btn-darkbrown w-full gap-2" 
          onClick={newPage}
        >
          <Settings size={18} /> Advanced Settings
        </button>
      </div>
    </div>
  );
}

export default Popup;