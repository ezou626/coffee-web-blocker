import React, { useState } from 'react';
import { Link, LinkItem } from './LinkItem';

export type { Link } from './LinkItem';

export interface BlockListProps {
  removeSelf: () => void,
  addSelf: () => void;
  listName: string
}

export const BlockListItem: React.FC<BlockListProps> = ({
  listName,
  removeSelf,
  addSelf
}) => {

  const [selected, setSelected] = useState(false);
  
  const handleClick = () => {
    setSelected(!selected);
    if (selected) {
      addSelf();
      return;
    }
    removeSelf();
  }

  if (selected) {
    return (
      <li className="text-xl">
        <button onClick={handleClick}>{listName}</button>
      </li>
    );
  }

  return (
    <li className="">
        <button onClick={handleClick}>{listName}</button>
    </li>
  );
};

export default BlockListItem;