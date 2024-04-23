import React, { useState } from 'react';

export interface Link {
  id: number;
  url: string;
}

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
    } else {
      removeSelf();
    }
  }

  if (selected) {
    return (
      <li className="">
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