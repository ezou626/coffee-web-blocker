import React, { useEffect, useState } from 'react';
import { BlockListMetadata } from '../api/BlockListAPI';

export interface BlockListProps {
  selected: boolean,
  removeSelf: () => void,
  addSelf: () => void;
  key: BlockListMetadata
}

const BlockListItem: React.FC<BlockListProps> = ({
  key,
  removeSelf,
  addSelf,
  selected
}) => {

  const handleClick = () => {
      if (selected) {
        removeSelf();
      } else {
        addSelf();
    };
  };

  return (
    <li key={key.id} className={ selected ? "text-red-100" : "text-blue-100"}>
      <button onClick={handleClick}>{key.name}</button>
    </li>
  );
};

export default BlockListItem;