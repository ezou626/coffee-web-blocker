import React, { useState } from 'react';
import { Link, BlockListItem } from './BlockListItem';

export interface BlockListListProps {
  lists: BlockList[];
  setSelectedLists: React.Dispatch<React.SetStateAction<Set<number>>>;
}

export interface BlockList {
  id: number;
  name: string;
  // no links need to be stored since this is just frontend
}

export const BlockListList: React.FC<BlockListListProps> = ({
  lists,
  setSelectedLists,
}) => {

  const addItem = (item: number) => (() => setSelectedLists(prev => new Set(prev).add(item)));

  const removeItem = (item: number) => (() =>
    setSelectedLists(prev => {
      const next = new Set(prev);
      next.delete(item);
      return next;
    }));

  return (
    <ul id='lists' className="">
      {lists.map((blocklist: BlockList) => (
        <BlockListItem
          key={blocklist.id}
          listName={blocklist.name}
          removeSelf={removeItem(blocklist.id)}
          addSelf={addItem(blocklist.id)}
        />
      ))}
    </ul>
  );
};

export default BlockListList;