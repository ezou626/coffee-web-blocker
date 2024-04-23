import React, { useState, useEffect } from 'react';
import { Link } from './components/BlockListItem';
import { BlockList, BlockListList } from './components/BlockListList';
import './globals.css';

// Define a sample link for initial state when local storage is empty
const link_1: Link = { id: 1, url: 'https://youtube.com' };
const link_2: Link = { id: 2, url: 'https://nbc.com' };
const link_3: Link = { id: 2, url: 'https://abc.com' };

const list_1: BlockList = {
  id: 1,
  name: "News"
}

const list_2: BlockList = {
  id: 2,
  name: "Games"
}

const list_3: BlockList = {
  id: 3,
  name: "Socials"
}

const generate_selected = (set: Set<number>) => {
  const array = Array.from(set); 
  return array.map((number) => <p>{number}</p>)
}

function App() {
  // Define the state variable for storing the list of blocklists
  const [lists, setLists] = useState<BlockList[]>([]);
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

  // // Handler for editing a snippet
  // const handleEditLink = (id: number, newText: string) => {
  //   // Create a new array with the updated snippet
  //   const updatedLinks = links.map((link) =>
  //     link.id === id ? { ...link, text: newText } : link
  //   );
  //   // Update the state with the new array
  //   setLinks(updatedLinks);
  //   // Save the updated snippets to local storage
  //   chrome.storage.local.set({ link: updatedLinks });
  // };

  // // Handler for deleting a snippet
  // const handleDeleteLink = (id: number) => {
  //   // Create a new array without the deleted snippet
  //   const updatedLinks = links.filter((link) => link.id !== id);
  //   // Update the state with the new array
  //   setLinks(updatedLinks);
  //   // Save the updated snippets to local storage
  //   chrome.storage.local.set({ links: updatedLinks });
  // };

  return (
    <div className='min-w-full min-h-full flex-col flex items-center bg-red-300 text-orange-500'>
      <h1 className="text-xl p-2 font-bold">Start a New Session</h1>
      <BlockListList
        lists={lists}
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