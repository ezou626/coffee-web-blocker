/**
 * This component is designed to add the active tab URL to a specified block list
 */

import React, { useState, useEffect } from "react";
import { BlockListMetadata } from "../api/BlockListAPI";
import { DB_NAME, DB_VERSION, LINK_STORE} from '../config';

export interface BlockListUpdaterProps {
  lists: BlockListMetadata[];
}

const BlockListUpdater: React.FC<BlockListUpdaterProps> = ({
  lists
}) => {
  const [currentList, setCurrentList] = useState<number>(0);
  const [currentTabUrl, setCurrentTabUrl] = useState<string | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'getCurrentTab' }, (response) => {
        setCurrentTabUrl(response.tabUrl);
    });
  }, []);

  //Extract url

  const handleUrlAdd = () => {
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onsuccess = (event) => {
      const db: IDBDatabase = dbRequest.result;
      const linkTransaction = db.transaction(LINK_STORE, 'readwrite');
      const linkStore = linkTransaction.objectStore(LINK_STORE);
      linkStore.add({ blockListId: lists[currentList].id, url: currentTabUrl});
    }
  }

  return (
  <div className="flex-col flex items-center space-y-2">
    <h2 className="text-md text-center max-w-xs max-h-12 overflow-y-scroll overflow-x-hidden">Current Tab URL: {currentTabUrl && <>{currentTabUrl}</>}</h2>
    <select className="select w-full max-w-xs">
      {lists.map((list, index) => (<option 
        value={index} 
        onClick={() => setCurrentList(index)}
        key={index}
      >{list.name}</option>))}
    </select>
    <span className="w-full">
      <button onClick={handleUrlAdd} className="btn w-5/12 max-w-xs">Add URL to List</button>
      <button className="btn w-7/12 max-w-xs">Add Domain to List</button>
    </span>
  </div>
  );
}

export default BlockListUpdater;