import * as React from 'react';
import { useState, useEffect } from 'react';
import { BlockList, BlockListMetadata, Link } from './api/BlockListAPI';
import BlockListList from './popup_components/BlockListList';
import BlockListUpdater from './popup_components/BlockListUpdater';

const list_1: BlockListMetadata = {
  id: 1,
  name: "News"
}

const list_2: BlockListMetadata = {
  id: 2,
  name: "Games"
}

const list_3: BlockListMetadata = {
  id: 3,
  name: "Socials"
}

const generate_selected = (set: Set<number>) => {
  const array = Array.from(set); 
  return array.map((number) => <li key={number}>{number}</li>)
}

function Popup() {
  // Define the state variable for storing the list of blocklists
  const [lists, setLists] = useState<BlockListMetadata[]>([]);
  const [selectedLists, setSelectedLists] = useState(new Set<number>());

  // Use useEffect to load blocklists from local storage when the component mounts
  useEffect(() => {
    chrome.storage.local.get('lists', (result) => {
      if (result.links === undefined) {
        // If 'lists' key doesn't exist in local storage, set the initial state with the sample snippet
        setLists([list_1, list_2, list_3]);
      } else {
        // If 'lists' key exists in local storage, set the state with the stored snippets
        setLists(result.lists);
      }
    });
  }, []);

  const newPage = () => {
    chrome.runtime.sendMessage({action: 'openSettingsPage'}, 
  (()=> {return;}));
  }

  return (
    <div className='min-w-full min-h-full flex-col flex items-center bg-tan text-brown space-y-5'>
      <h1 className="text-2xl p-2 font-bold">Coffee Web Blocker</h1>

      <BlockListList
        lists={lists}
        selectedLists={selectedLists}
        setSelectedLists={setSelectedLists}
      />
      
      <BlockListUpdater />

      <button onClick={newPage}>Advanced Settings</button>
    </div>
  );
}

export default Popup;