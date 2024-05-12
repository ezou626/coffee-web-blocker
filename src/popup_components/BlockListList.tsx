import React, {useState, useEffect} from 'react';
import { BlockListMetadata, LinkResult } from '../api/BlockListAPI';
import { DB_NAME, DB_VERSION, LINK_STORE } from '../config';

export interface BlockListListProps {
  lists: BlockListMetadata[];
  selectedLists: Set<number>;
  setSelectedLists: React.Dispatch<React.SetStateAction<Set<number>>>;
}

async function getBlockListURLS (id: number): Promise<string[]> {
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
        resolve(urlList);
      }

      getLinksRequest.onerror = () => {
        resolve(urlList);
      }
    }
  });
  return p;
}

/**
 * Allows the user to start a blocking session with a specified set of blocklists
 * @param param0 
 * @returns 
 */
const BlockListList: React.FC<BlockListListProps> = ({
  lists,
  selectedLists,
  setSelectedLists,
}) => {

  const [isBlocking, setIsBlocking] = useState<boolean>(false);

  // checks if blocking is active
  useEffect(() => {
    chrome.storage.local.get('isBlocking').then((isBlocking) => {
      setIsBlocking(isBlocking['isBlocking'] === 'true');
    });
  }, [])

  const handleListSelect = (id: number) => (() => {
    if (selectedLists.has(id)) {
      setSelectedLists(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      setSelectedLists(prev => new Set(prev).add(id))
    }
  })

  const handleUnblock = () => {
    chrome.storage.local.set({blocked: []});
    chrome.storage.local.set({isBlocking: 'false'});
    setIsBlocking(false);
  }

  const handleBlock = async () => {
    const blockedUrls: string[] = [];
    for (let id of selectedLists.values()) {
      const urls: string[] = await getBlockListURLS(id);
      for (const url of urls) {
        blockedUrls.push(url);
      }
    }
    chrome.storage.local.set({blocked: blockedUrls});
    chrome.storage.local.set({isBlocking: 'true'});
    setIsBlocking(true);
  }

  return (<div className="flex-col flex items-center">
    { isBlocking ? 
      <button id='end' className="btn" onClick={handleUnblock}>End Blocking Sesssion</button> : 
      <>
        <h1 className="text-lg">Start a New Session</h1>
        <ul id='lists' className="">
          {lists.map((blocklist: BlockListMetadata) => (
            <li key={blocklist.id} className={ selectedLists.has(blocklist.id) ? "font-bold" : ""}>
              <button onClick={handleListSelect(blocklist.id)}>{blocklist.name}</button>
            </li>
          ))}
        </ul>
        <button id='begin' className="btn" onClick={handleBlock}>Block These Lists</button>
      </>
    }
  </div>);
};

export default BlockListList;