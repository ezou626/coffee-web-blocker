import React from 'react';
import BlockListItem from './BlockListItem';
import { BlockListMetadata } from '../api/BlockListAPI';

export interface BlockListListProps {
  lists: BlockListMetadata[];
  setSelectedLists: React.Dispatch<React.SetStateAction<Set<number>>>;
}

const BlockListList: React.FC<BlockListListProps> = ({
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

  return (<>
    <ul id='lists' className="">
      {lists.map((blocklist: BlockListMetadata) => (
        <BlockListItem
          key={blocklist.id}
          listName={blocklist.name}
          removeSelf={removeItem(blocklist.id)}
          addSelf={addItem(blocklist.id)}
        />
      ))}
    </ul>
    <button id='begin' className="text-xl p-2 font-bold">Start</button>
  </>);
};

export default BlockListList;