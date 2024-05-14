/**
 * This component is designed to modify a blocklist
 */

import React, { useState, useEffect, ChangeEvent } from "react";
import { BlockListMetadata, LinkResult } from "../api/BlockListAPI";
import { DB_NAME, DB_VERSION, LINK_STORE} from '../config';

export interface BlockListEditorProps {
  currentList: BlockListMetadata;
  links: LinkResult[];
};

const BlockListEditor: React.FC<BlockListEditorProps> = ({
  currentList,
  links
}) => {
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
    if (!currentTabUrl) return;
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onsuccess = (event) => {
      const db: IDBDatabase = dbRequest.result;
      const linkTransaction = db.transaction(LINK_STORE, 'readwrite');
      const linkStore = linkTransaction.objectStore(LINK_STORE);
      linkStore.add({ blockListId: currentList.id, url: currentTabUrl});
    }
  }

  const handleDomainAdd = () => {
    if (!currentTabUrl) return;
    const domain = getDomainFromURL(currentTabUrl);
    if (!domain) return;
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onsuccess = (event) => {
      const db: IDBDatabase = dbRequest.result;
      const linkTransaction = db.transaction(LINK_STORE, 'readwrite');
      const linkStore = linkTransaction.objectStore(LINK_STORE);
      linkStore.add({ blockListId: currentList.id, url: domain});
    }
  };

  return (
  <div className="flex-col flex items-center space-y-2">
    {/* <h2 className="text-lg text-center max-w-xs font-bold">Add Tab to List</h2> */}
    {/* <span className="flex w-full space-x-3 justify-center items-center">
      <button onClick={handleUrlAdd} className="btn w-5/12 max-w-xs">Add Just URL</button>
      <button className="btn w-5/12 max-w-xs" onClick={handleDomainAdd}>Add Entire Site</button>
    </span> */}
    <ul id='lists' className="flex flex-col">
      {links.map((link: LinkResult) => (
        <li key={link.id}>
            {link.url}
        </li>
      ))}
    </ul>
  </div>
  );
}

export default BlockListEditor;