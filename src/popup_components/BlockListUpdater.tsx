/**
 * This component is designed to add the active tab URL to a specified block list
 */

import React, { useState, useEffect, ChangeEvent } from "react";
import { BlockListMetadata } from "../api/BlockListAPI";
import { DB_NAME, DB_VERSION, LINK_STORE} from '../config';

export interface BlockListUpdaterProps {
  lists: BlockListMetadata[];
}

const BlockListUpdater: React.FC<BlockListUpdaterProps> = ({
  lists
}) => {
  const [currentList, setCurrentList] = useState<number>(lists.length > 0 ? lists[0].id : 0);
  const [currentTabUrl, setCurrentTabUrl] = useState<string | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'getCurrentTab' }, (response) => {
        setCurrentTabUrl(response.tabUrl);
    });
  }, []);

  //Extract domain from url
  const getDomainFromURL = (url: string) => {
    try {
      const newURL = new URL(url)
      return newURL.hostname;
    } catch (error: any){
      console.error('Error parsing URL:', error);
      return null
    }
  }

  const handleUrlAdd = () => {
    if (currentList === 0) { //didn't select list yet
      return;
    }
    if (!currentTabUrl) return;
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onsuccess = (event) => {
      const db: IDBDatabase = dbRequest.result;
      const linkTransaction = db.transaction(LINK_STORE, 'readwrite');
      const linkStore = linkTransaction.objectStore(LINK_STORE);
      linkStore.add({ blockListId: currentList, url: currentTabUrl});
    }
  }

  const handleDomainAdd = () => {
    if (currentList === 0) { //didn't select list yet
      return;
    }
    if (!currentTabUrl) return;
    const domain = getDomainFromURL(currentTabUrl);
    if (!domain) return;
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onsuccess = (event) => {
      const db: IDBDatabase = dbRequest.result;
      const linkTransaction = db.transaction(LINK_STORE, 'readwrite');
      const linkStore = linkTransaction.objectStore(LINK_STORE);
      linkStore.add({ blockListId: currentList, url: domain});
    }
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectElement: HTMLSelectElement = event.target;
    setCurrentList(parseInt(selectElement.value)); // its awful lol
  };

  return (
  <div className="flex-col flex items-center space-y-2">
    <h2 className="text-lg text-center max-w-xs font-bold">Add Tab to List</h2>
    <h2 className="text-md text-center max-w-xs max-h-12 overflow-y-scroll overflow-x-hidden">{currentTabUrl && <>{currentTabUrl}</>}</h2>
    <select className="select w-full max-w-xs" onChange={handleSelectChange} defaultValue={0}>
      <option disabled value={0}>Select a List to Add To</option>
      {lists.map((list) => (<option 
        value={list.id} key={list.id}
      >{list.name}</option>))}
    </select>
    <span className="flex w-full space-x-3 justify-center items-center">
      <button onClick={handleUrlAdd} className="btn w-5/12 max-w-xs">Add Just URL</button>
      <button className="btn w-5/12 max-w-xs" onClick={handleDomainAdd}>Add Entire Site</button>
    </span>
  </div>
  );
}

export default BlockListUpdater;