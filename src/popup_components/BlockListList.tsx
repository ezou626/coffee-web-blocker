import React from 'react';
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

  return (<div className="flex-col flex items-center">
    <h1 className="text-lg">Start a New Session</h1>
    <ul id='lists' className="">
      {lists.map((blocklist: BlockListMetadata) => (
        <li key={blocklist.id} className={ selectedLists.has(blocklist.id) ? "font-bold" : ""}>
          <button onClick={handleClick(blocklist.id)}>{blocklist.name}</button>
        </li>
      ))}
    </ul>
    <button id='begin' className="btn">Block</button>
  </div>);
};

export default BlockListList;