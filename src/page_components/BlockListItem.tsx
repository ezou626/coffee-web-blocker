import React, { useState } from 'react';
import { BlockList } from '../api/BlockListAPI';

export interface BlockListItemProps {
  blockList: BlockList;
  updateBlockList: (updatedList: BlockList) => void;
}

export const BlockListItem: React.FC<BlockListItemProps> = ({
  blockList,
  updateBlockList,
}) => {
  const [newWebsite, setNewWebsite] = useState('');

  const handleWebsiteAddition = () => {
    if (newWebsite) {
      const updatedBlockList = {
        ...blockList,
        websites: [...blockList.links, newWebsite],
      };
      updateBlockList(updatedBlockList);
      setNewWebsite('');
    }
  };

  const handleWebsiteRemoval = (websiteToRemove: string) => {
    const updatedBlockList = {
      ...blockList,
      websites: blockList.links.filter(website => website.url !== websiteToRemove),
    };
    updateBlockList(updatedBlockList);
  };

  return (
    <li className="my-2">
      <div className="flex flex-col">
        <div className="flex justify-between items-center text-xl text-espresso rounded-lg">
          <span>{blockList.name}</span>
          <div>
            {blockList.links.map((website, index) => (
              <span key={index} className="ml-2">
                {website.url}
                <button onClick={() => handleWebsiteRemoval(website.url)} className="text-espresso hover:text-brown ml-1">
                  x
                </button>
              </span>
            ))}
          </div>
        </div>
        <input
          type="text"
          value={newWebsite}
          onChange={(e) => setNewWebsite(e.target.value)}
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