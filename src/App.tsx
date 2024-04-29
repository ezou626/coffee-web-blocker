import * as React from 'react';
import { useState, useEffect } from 'react';
import { BlockList, BlockListMetadata, Link } from './api/BlockListAPI';
import BlockListList from './components/BlockListList';

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

function App() {
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

  return (
    <div className='min-w-full min-h-full flex-col flex items-center bg-red-300 text-orange-500'>
      <h1 className="text-xl p-2 font-bold">Start a New Session</h1>
      <BlockListList
        lists={lists}
        selectedLists={selectedLists}
        setSelectedLists={setSelectedLists}
      />
      <ul id='lists' className="">
        {generate_selected(selectedLists)}
      </ul>
      <button id='begin' className="text-xl p-2 font-bold">Start</button>
    </div>
  );
}

export default App;