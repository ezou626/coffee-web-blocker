import React from 'react';
import BlockListItem from './BlockListItem';
import { BlockListMetadata } from '../api/BlockListAPI';

export interface BlockListListProps {
  lists: BlockListMetadata[];
  selectedLists: Set<number>;
  setSelectedLists: React.Dispatch<React.SetStateAction<Set<number>>>;
}

const BlockListList: React.FC<BlockListListProps> = ({
  lists,
  selectedLists,
  setSelectedLists,
}) => {

  const handleClick = (id: number) => (() => {
    if (selectedLists.has(id)) {
      setSelectedLists(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      setSelectedLists(prev => new Set(prev).add(id))
    }
  })

  return (<>
    <ul id='lists' className="">
      {lists.map((blocklist: BlockListMetadata) => (
        <li key={blocklist.id} className={ selectedLists.has(blocklist.id) ? "text-red-100" : "text-blue-100"}>
          <button onClick={handleClick(blocklist.id)}>{blocklist.name}</button>
        </li>
      ))}
    </ul>
    <button id='begin' className="text-xl p-2 font-bold">Start</button>
  </>);
};

export default BlockListList;