import React, { useState, useEffect } from 'react';
import { Link, BlockList } from './components/BlockList';

// Define a sample link for initial state when local storage is empty
const sample_link: Link = { id: 1, url: 'Sample snippet' };

function App() {
  // Define the state variable for storing the list of links
  const [links, setLinks] = useState<Link[]>([]);

  // Use useEffect to load snippets from local storage when the component mounts
  useEffect(() => {
    chrome.storage.local.get('links', (result) => {
      if (result.links === undefined) {
        // If 'links' key doesn't exist in local storage, set the initial state with the sample snippet
        setLinks([sample_link]);
      } else {
        // If 'links' key exists in local storage, set the state with the stored snippets
        setLinks(result.links);
      }
    });
  }, []);

  // Handler for editing a snippet
  const handleEditLink = (id: number, newText: string) => {
    // Create a new array with the updated snippet
    const updatedLinks = links.map((link) =>
      link.id === id ? { ...link, text: newText } : link
    );
    // Update the state with the new array
    setLinks(updatedLinks);
    // Save the updated snippets to local storage
    chrome.storage.local.set({ link: updatedLinks });
  };

  // Handler for deleting a snippet
  const handleDeleteLink = (id: number) => {
    // Create a new array without the deleted snippet
    const updatedLinks = links.filter((link) => link.id !== id);
    // Update the state with the new array
    setLinks(updatedLinks);
    // Save the updated snippets to local storage
    chrome.storage.local.set({ links: updatedLinks });
  };

  return (
    <div>
      <h1 className="text-xl">Snippet Collector</h1>
      {/* Render the SnippetList component with the snippets and event handlers */}
      <BlockList
        links={links}
        onEditLink={handleEditLink}
        onDeleteLink={handleDeleteLink}
      />
    </div>
  );
}

export default App;