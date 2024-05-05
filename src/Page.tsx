import React, { useState } from 'react';
import { BlockList } from './api/BlockListAPI';
import BlockListList from './page_components/BlockListList';

const App: React.FC = () => {
  const [lists, setLists] = useState<BlockList[]>([
    { id: 1, name: 'News', links: [] },
    { id: 2, name: 'Games', links: [] },
    { id: 3, name: 'Socials', links: [] },
  ]);

  const updateBlockList = (updatedList: BlockList) => {
    setLists(lists.map(list => list.id === updatedList.id ? updatedList : list));
  };

  return (
    <div className="min-w-full min-h-screen flex flex-col items-center bg-cream">
      <BlockListList lists={lists} updateBlockList={updateBlockList} />
    </div>
  );
};

export default App;