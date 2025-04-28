import React, {useState, useEffect} from 'react';
import { BlockListMetadata, LinkResult } from '../api/BlockListAPI';
import { DB_NAME, DB_VERSION, LINK_STORE } from '../config';
import MultipleSelect from './MultipleSelectComponent';
import { ActionMeta, MultiValue } from 'react-select/dist/declarations/src/types';

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

  const handleListSelect = (list: BlockListMetadata) => {
    let id = list.id;
    if (selectedLists.has(id)) {
      setSelectedLists(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      setSelectedLists(prev => new Set(prev).add(id))
    }
  }

  const handleChange = (options: MultiValue<BlockListMetadata>, 
    actionMeta: ActionMeta<BlockListMetadata>) => {
    switch (actionMeta.action) {
      case 'clear':
        setSelectedLists(new Set());
        break;
      case 'select-option':
        handleListSelect(actionMeta.option!);
        break;
      case 'remove-value':
        handleListSelect(actionMeta.removedValue);
        break;
      default:
        break;
    }
  }

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
    //nested promises ensure storage is updated before the worker checks current tab
    chrome.storage.local.set({blocked: blockedUrls}).then(() => {
      chrome.storage.local.set({isBlocking: 'true'}).then(() => {
        setIsBlocking(true);
        chrome.runtime.sendMessage({
          action: 'checkCurrentTab'
        })
      })
    });
    chrome.storage.local.set({isBlocking: 'true'});
    setIsBlocking(true);
  }

  return (<div className="flex-col flex items-center justify-between">
    { isBlocking ?
      <>
      <h1 className="text-lg font-bold">Currently Blocking</h1>
      <button id='end' className="btn" onClick={handleUnblock}>End Blocking Session</button>
      </> : 
      <>
        <h1 className="text-lg font-bold text-darkbrown">Start a New Session</h1>
       
        <div className="flex flex-row w-full items-center justify-center">
        <MultipleSelect<BlockListMetadata, true>
          isMulti
          unstyled
          defaultValue={[]}
          placeholder="Search Lists"
          onChange={handleChange}
          getOptionLabel={list => list.name}
          getOptionValue={list => String(list.id)}
          closeMenuOnSelect={false}
          isClearable={true}
          isSearchable={true}
          options={lists}
          noOptionsMessage={() => null}
          classNames={{
            container: () => "w-2/3 border-darkbrown",
            control: () => "text-md hover:cursor-pointer p-1 rounded border-darkbrown w-full",
            menu: () => "text-base-content bg-base-100 text-md p-1 border border-darkbrown rounded mt-1",
            option: () => "px-3 py-2 hover:cursor-pointer hover:bg-darkbrown hover:text-white rounded"
          }}
        ></MultipleSelect>
         <button id='begin' className="btn btn-primary bg-darkbrown border-darkbrown text-white" onClick={handleBlock}>Block</button>
    
        </div>
       
      </>
    }
  </div>);
};

export default BlockListList;