/**
 * This component is designed to provide a view to all blocklists and allow one to be selected
 */
import React, {useEffect, useState} from 'react';
import { BlockListMetadata, LinkResult } from '../api/BlockListAPI';
import { DB_NAME, DB_VERSION, BLOCKLIST_STORE, LINK_STORE } from '../config';
import BlockListEditor from './BlockListEditor';

export interface BlockListListProps {
  lists: BlockListMetadata[];
  setLists: React.Dispatch<React.SetStateAction<BlockListMetadata[]>>;
}

async function getLinks (id: number): Promise<LinkResult[]> {
  const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  const p: Promise<LinkResult[]> = new Promise((resolve, reject) => {
    dbRequest.onsuccess = (event) => {
      const db: IDBDatabase = dbRequest.result;
      const linksTransaction = db.transaction(LINK_STORE, 'readonly');
      const linksStore = linksTransaction.objectStore(LINK_STORE);
      const index = linksStore.index('blockListIndex');
      const getLinksRequest = index.getAll(id);
      getLinksRequest.onsuccess = () => {
        const links: LinkResult[] = getLinksRequest.result;
        resolve(links);
      }
      getLinksRequest.onerror = () => {
        resolve([]);
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
  setLists,
}) => {

  const [selectedList, setSelectedList] = useState<BlockListMetadata | null>(null);
  const [links, setLinks] = useState<LinkResult[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    if (selectedList == null) {
      return;
    }
    getLinks(selectedList.id).then((linkResults) => {
      setLinks(linkResults);
    })
  }, [selectedList]);

  if (selectedList != null) {
    return <div className="flex-col min-w-full" >
    <button onClick={() => {setSelectedList(null)}} className='btn m-5'>Back</button>
    <div className="flex-col flex items-center min-w-full">
      <BlockListEditor 
        currentList={selectedList} 
        links={links} 
        setLinks={setLinks}>
      </BlockListEditor>
    </div>
    </div>;
  }

  const handleDelete = (id: number) => (() => {
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onsuccess = (event) => {
      const db = dbRequest.result;
      const transaction = db.transaction([BLOCKLIST_STORE, LINK_STORE], 'readwrite');
      const listStore = transaction.objectStore(BLOCKLIST_STORE);
      const deleteList = listStore.delete(id); // should be unique
      deleteList.onsuccess = () => {};
      const linkStore = transaction.objectStore(LINK_STORE);
      const listIndex = linkStore.index('blockListIndex');
      const getRequest = listIndex.getAll(id);
      getRequest.onsuccess = () => {
        const linksToDelete: LinkResult[] = getRequest.result;
        linksToDelete.forEach((link) => {
          linkStore.delete(link.id);
        })
      }
      transaction.oncomplete = () => {
        setLists(lists.filter((list) => list.id !== id));
      }
    };
  })

  const handleAdd = (name: string) => (() => {
    if (lists.some(list => list.name === name)) {
      setErrorMessage('List exists already');
      return;
    }
    if (name.trim() === '') {
      setErrorMessage('Input cannot be empty');
      return;
    }
    setErrorMessage('');
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onsuccess = (event) => {
      const db = dbRequest.result;
      const transaction = db.transaction(BLOCKLIST_STORE, 'readwrite');
      const listStore = transaction.objectStore(BLOCKLIST_STORE);
      const addRequest = listStore.add({name: name});
      addRequest.onsuccess = (event: Event) => {
        const target = event.target  as IDBRequest;
        setLists([...lists, {id: target.result, name: name}]);
      }
    }
  })

  return (
  <div className="flex-col flex items-center min-w-full">
    <h1 className="text-2xl font-bold pt-5 text-darkbrown">Manage BlockLists</h1>
    <h2 className="text-lg pt-5 text-darkbrown">Click on a BlockList Name to Edit It</h2>
    <span className="pt-5 space-x-5">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Add a New Blocklist"
        className='input input-bordered border-darkbrown'
      /><button onClick={handleAdd(inputValue)}
      className="btn btn-primary bg-darkbrown text-white border-darkbrown hover:border-darkbrown hover:bg-pink text-center">Add
    </button> {errorMessage && <p className='text-primary pt-5'>{errorMessage}</p>}</span>
    <ul id='lists' className="flex flex-wrap space-x-5 p-5 min-w-96 max-w-lg">
      {lists.map((blocklist: BlockListMetadata) => (
        <li key={blocklist.id} className="flex">
          <button onClick={() => {setSelectedList(blocklist)}}
          className="btn btn-primary bg-darkbrown border-darkbrown hover:bg-pink hover:border-darkbrown text-white text-center">
            {blocklist.name} 
          </button>
          <div onClick={handleDelete(blocklist.id)}
          className="btn text-center hover:cursor-pointer">
            <span className="text-darkbrown hover:text-white font-bold">&#10005;</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default BlockListList;