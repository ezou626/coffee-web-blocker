import React, { useEffect, useState } from 'react';
import BlockListList from './BlockListList';
import { BlockListMetadata } from '../api/BlockListAPI';
import { DB_NAME, DB_VERSION, BLOCKLIST_STORE } from '../config';

function Page() {

  const [lists, setLists] = useState<BlockListMetadata[]>([]);

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
  
  return <BlockListList lists={lists} setLists={setLists}></BlockListList>;
}

export default Page;