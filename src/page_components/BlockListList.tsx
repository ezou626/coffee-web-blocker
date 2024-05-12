/**
 * BlockList Container in Chrome Extension Standalone Page
 */

import React from "react";
import { BlockList } from "../api/BlockListAPI";
import BlockListItem from "./BlockListItem";

export interface BlockListListProps {
  lists: BlockList[];
  updateBlockList: (updatedList: BlockList) => void;
}

export const BlockListList: React.FC<BlockListListProps> = ({
  lists,
  updateBlockList,
}) => {
  return (
    <div className="min-w-half min-h-screen flex flex-col items-center bg-cream">
      <h1 className="text-3xl font-bold mb-8 text-brown mt-5">
        Edit Blocklists
      </h1>
      <ul className="w-full space-y-5">
        {lists.map((blockList) => (
          <BlockListItem
            key={blockList.id}
            blockList={blockList}
            updateBlockList={updateBlockList}
          />
        ))}
      </ul>
      <button
        id="begin-session"
        className="px-8 py-4 bg-toast text-cream font-bold rounded-lg mt-4"
      >
        Save
      </button>
    </div>
  );
};

export default BlockListList;
