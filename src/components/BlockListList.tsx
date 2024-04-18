import React, { useState } from 'react';
import { Link, LinkItem } from './LinkItem';
import { BlockListItem } from './BlockListItem';

export interface BlockListListProps {
  lists: BlockList[];
}

export interface BlockList {
  id: number;
  name: string;
  links: Link[];
}

export const BlockListList: React.FC<BlockListListProps> = ({
  lists,
}) => {
  const [state, setState] = useState(() => new Set<number>());

  const addItem = (item: number) => (() => setState(prev => new Set(prev).add(item)));

  const removeItem = (item: number) => (() =>
    setState(prev => {
      const next = new Set(prev);

      next.delete(item);

      return next;
    }));

  return (
    <ul className="">
      {lists.map((list: BlockList) => (
        <BlockListItem
          key={list.id}
          listName={list.name}
          removeSelf={removeItem(list.id)}
          addSelf={removeItem(list.id)}
        />
      ))}
    </ul>
  );
};

export default BlockListList;