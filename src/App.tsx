import React, { useState, useEffect } from 'react';
import { Link } from './components/BlockListItem';
import { BlockList, BlockListListProps, BlockListList } from './components/BlockListList';

// Define a sample link for initial state when local storage is empty
const link_1: Link = { id: 1, url: 'https://youtube.com' };
const link_2: Link = { id: 2, url: 'https://nbc.com' };
const link_3: Link = { id: 2, url: 'https://abc.com' };

const list_1: BlockList = {
  id: 1,
  name: "News",
  links: [link_1, link_2, link_3],
}

function App() {
  // Define the state variable for storing the list of blocklists
  const [lists, setLists] = useState<BlockList[]>([]);

  // Use useEffect to load blocklists from local storage when the component mounts
  useEffect(() => {
    chrome.storage.local.get('lists', (result) => {
      if (result.links === undefined) {
        // If 'lists' key doesn't exist in local storage, set the initial state with the sample snippet
        setLists([list_1]);
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
    <div>
      <h1 className="text-xl">Start a New Session</h1>
      <BlockListList
        lists={lists}
      />
    </div>
  );
}

export default App;