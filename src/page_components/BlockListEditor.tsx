/**
 * This component is designed to modify a blocklist
 */

import React, { useState } from "react";
import { BlockListMetadata, LinkResult } from "../api/BlockListAPI";
import { DB_NAME, DB_VERSION, LINK_STORE} from '../config';
import { Plus, X, Globe, Link as LinkIcon } from 'lucide-react';

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
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-darkbrown">
        Edit {currentList.name}
      </h1>
      
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                value={currentUrl}
                onChange={handleUrlChange}
                placeholder="Enter URL to block"
                className="input input-bordered w-full"
              />
              <div className="join">
                <button 
                  onClick={handleUrlAdd} 
                  className="btn btn-primary join-item gap-2"
                >
                  <LinkIcon size={16} /> Add URL
                </button>
                <button 
                  onClick={handleDomainAdd} 
                  className="btn btn-secondary join-item gap-2"
                >
                  <Globe size={16} /> Add Domain
                </button>
              </div>
            </div>
            {errorMessage && (
              <div className="alert alert-error mt-4">
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-darkbrown mb-4">Blocked Sites</h2>
          
          {links.length === 0 ? (
            <div className="alert">
              <span>No sites are currently blocked in this list. Add some URLs above.</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {links.map((link: LinkResult) => (
                <div key={link.id} className="flex items-center justify-between bg-base-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Globe size={16} className="text-darkbrown shrink-0" />
                    <span className="truncate">{link.url}</span>
                  </div>
                  <button 
                    onClick={handleLinkDelete(link.id)}
                    className="btn btn-circle btn-sm btn-ghost text-error"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlockListEditor;