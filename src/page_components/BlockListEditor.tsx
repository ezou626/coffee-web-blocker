/**
 * This component is designed to modify a blocklist
 */

import React, { useState, useEffect, ChangeEvent } from "react";
import { BlockListMetadata, LinkResult } from "../api/BlockListAPI";
import { DB_NAME, DB_VERSION, LINK_STORE} from '../config';

const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

export interface BlockListEditorProps {
  currentList: BlockListMetadata;
  links: LinkResult[];
  setLinks: React.Dispatch<React.SetStateAction<LinkResult[]>>
};

const BlockListEditor: React.FC<BlockListEditorProps> = ({
  currentList,
  links,
  setLinks
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUrl(event.target.value);
  };

  //Extract domain from url
  const getDomainFromURL = (url: string) => {
    try {
      const newURL = new URL(url)
      return newURL.hostname;
    } catch (error: any){
      console.error('Error parsing URL:', error);
      return null;
    }
  }

  const handleUrlAdd = () => {
    if (currentUrl == '') {
      setErrorMessage('URL must not be empty');
      return;
    }
    const regex = new RegExp(expression);
    if (!regex.test(currentUrl)) {
      setErrorMessage('URL must be valid');
      return;
    }
    if (links.some(link => link.url === currentUrl)) {
      setErrorMessage('Domain exists in list!');
      return;
    }
    setErrorMessage('');
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onsuccess = (event) => {
      const db: IDBDatabase = dbRequest.result;
      const linkTransaction = db.transaction(LINK_STORE, 'readwrite');
      const linkStore = linkTransaction.objectStore(LINK_STORE);
      const request = linkStore.add({ blockListId: currentList.id, url: currentUrl});
      request.onsuccess = () => {
        const linkId: number = request.result as number;
        setLinks([...links, {id: linkId, blockListId: currentList.id, url: currentUrl}]);
        setCurrentUrl('');
      }
    }
  }

  const handleDomainAdd = () => {
    if (currentUrl == '') {
      setErrorMessage('URL must not be empty');
      return;
    }
    const regex = new RegExp(expression);
    if (!regex.test(currentUrl)) {
      setErrorMessage('URL must be valid');
      return;
    }
    const domain = getDomainFromURL(currentUrl);
    if (domain == null) {
      setErrorMessage('Failed to get domain, try adding the full URL');
      return;
    }
    if (links.some(link => link.url === domain)) {
      setErrorMessage('Domain exists in list!');
      return;
    }
    setErrorMessage('');
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onsuccess = (event) => {
      const db: IDBDatabase = dbRequest.result;
      const linkTransaction = db.transaction(LINK_STORE, 'readwrite');
      const linkStore = linkTransaction.objectStore(LINK_STORE);
      const request = linkStore.add({ blockListId: currentList.id, url: domain});
      request.onsuccess = () => {
        const linkId: number = request.result as number;
        setLinks([...links, {id: linkId, blockListId: currentList.id, url: domain}]);
        setCurrentUrl('');
      }
    }
  };

  const handleLinkDelete = (linkId: number) => (() => {
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onsuccess = (event) => {
      const db: IDBDatabase = dbRequest.result;
      const linkTransaction = db.transaction(LINK_STORE, 'readwrite');
      const linkStore = linkTransaction.objectStore(LINK_STORE);
      const request = linkStore.delete(linkId);
      request.onsuccess = () => {
        setLinks(links.filter(link => link.id !== linkId));
      }
    }
  })

  return (
  <div className="flex-col flex items-center space-y-2  min-w-full">
    <h1 className="text-2xl font-bold pt-5">Edit {currentList.name}</h1>
    <span className="pt-5 space-x-5 min-w-full px-20">
      <input
        type="text"
        value={currentUrl}
        onChange={handleUrlChange}
        placeholder="Add a New Link"
        className='input'
      />
      <button onClick={handleUrlAdd} className="btn text-center">
        Add URL
      </button> 
      <button onClick={handleDomainAdd} className="btn text-center">
        Add Domain
      </button> 
      {errorMessage && <p className='text-primary pt-5'>{errorMessage}</p>}
    </span>
    <ul id='links' className="flex flex-col space-y-1 px-20 min-w-full overflow-y-scroll">
      {links.map((link: LinkResult) => (
        <li key={link.id} className="w-full">
          <span className="w-full">
            <p className="btn text-center overflow-scroll-x w-3/4">
              {link.url} 
            </p>
            <div onClick={handleLinkDelete(link.id)}
            className="btn text-center hover:cursor-pointer">
              <span className="text-gray-500 hover:text-white font-bold">&#10005;</span>
            </div>
          </span>
        </li>
      ))}
    </ul>
  </div>
  );
}

export default BlockListEditor;