/**
 * This component is designed to provide a view to all blocklists and allow one to be selected
 */
import React, {useEffect, useState} from 'react';
import { BlockListMetadata, LinkResult } from '../api/BlockListAPI';
import { DB_NAME, DB_VERSION, BLOCKLIST_STORE, LINK_STORE } from '../config';
import BlockListEditor from './BlockListEditor';
import { Plus, X, ArrowLeft, Settings } from 'lucide-react';

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
    return (
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => {setSelectedList(null)}} 
          className="btn btn-sm btn-outline gap-2 mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex-col flex items-center w-full">
          <BlockListEditor 
            currentList={selectedList} 
            links={links} 
            setLinks={setLinks}
          />
        </div>
      </div>
    );
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
        setInputValue(''); // Clear input after adding
      }
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-darkbrown">Manage BlockLists</h1>
        <p className="text-lg mt-2 text-darkbrown">Click on a BlockList to edit it</p>
      </div>
      
      <div className="form-control max-w-md mx-auto mb-8">
        <div className="join w-full">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Add a New Blocklist"
            className="input input-bordered join-item w-full"
          />
          <button 
            onClick={handleAdd(inputValue)}
            className="btn join-item btn-primary gap-2"
          >
            <Plus size={18} /> Add
          </button>
        </div>
        {errorMessage && (
          <div className="alert alert-error mt-2">
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {lists.map((blocklist: BlockListMetadata) => (
          <div key={blocklist.id} className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <div className="flex justify-between items-center">
                <h2 className="card-title text-darkbrown">{blocklist.name}</h2>
                <button 
                  onClick={handleDelete(blocklist.id)}
                  className="btn btn-circle btn-sm btn-ghost text-error"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="card-actions justify-end mt-2">
                <button 
                  onClick={() => {setSelectedList(blocklist)}}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <Settings size={16} /> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockListList;