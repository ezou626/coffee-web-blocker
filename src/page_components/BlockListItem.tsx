/**
 * BlockList Editor in Chrome Extension Standalone Page
 */

import React, { useState } from 'react';
import { Link, BlockList } from '../api/BlockListAPI';

export interface BlockListItemProps {
  blockList: BlockList;
  updateBlockList: (updatedList: BlockList) => void;
}

export const BlockListItem: React.FC<BlockListItemProps> = ({
  blockList,
  updateBlockList,
}) => {
  const [newUrl, setNewUrl] = useState<string>('');
  // set to max of existing ids plus 1 for uniqueness
  const [nextId, setNextId] = useState<number>(
    blockList.links.length === 0 ? 0 : blockList.links.reduce((a, b) => a.id > b.id ? a : b).id + 1
  );

  const handleWebsiteAddition = () => {
    if (newUrl.length !== 0) {
      // don't duplicate links
      if (blockList.links.find((link) => link.url === newUrl)) {
        return;
      }
      const newLink: Link = {
        id: nextId,
        url: newUrl
      }
      const updatedBlockList: BlockList = {
        id: blockList.id,
        name: blockList.name,
        links: [...blockList.links, newLink],
      };
      updateBlockList(updatedBlockList);
      setNewUrl('');
      setNextId(nextId + 1);
    }
  };

  // may benefit from an optimization with bin-search or hashmap eventually
  const handleWebsiteRemoval = (targetId: number) => {
    const updatedBlockList = {
      id: blockList.id,
      name: blockList.name,
      links: blockList.links.filter(website => website.id !== targetId),
    };
    updateBlockList(updatedBlockList);
  };

  return (
    <li className="my-2">
      <div className="flex flex-col">
        <ul className="flex-col justify-between items-center text-xl text-espresso rounded-lg">
          <li key={-1}>{blockList.name}</li>
          {blockList.links.map((link, index) => (
            <li key={index} className="ml-2">
              {link.url}
              <button onClick={() => handleWebsiteRemoval(link.id)} className="text-espresso hover:text-brown ml-1">
                x
              </button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Add new site"
          className="mt-2 p-1 rounded-md text-cream placeholder-cream placeholder-opacity-50 bg-toast"
        />
        <button onClick={handleWebsiteAddition} className="text-espresso font-bold bg-toast hover:bg-tan p-1 rounded-md mt-1">
          Add
        </button>
      </div>
    </li>
  );
};

export default BlockListItem;