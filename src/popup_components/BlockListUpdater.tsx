/**
 * This component is designed to add the active tab URL to a specified block list
 */

import React, { useState, useEffect } from "react";

const BlockListUpdater: React.FC = () => {
  const [currentTabUrl, setCurrentTabUrl] = useState<string | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'getCurrentTab' }, (response) => {
        setCurrentTabUrl(response.tabUrl);
    });
  }, []);

  return (
  <div className="flex-col flex items-center bg-tan text-brown">
    <h2 className="text-lg">Current Tab URL:</h2>
    <p className="text-center max-w-60 max-h-fit overflow-wrap: break-words">{currentTabUrl && <>{currentTabUrl}</>}</p>
    <button className="bg-brown hover:bg-toast text-cream p-1 rounded-md mt-1">Add URL to List</button>
  </div>
  );
}

export default BlockListUpdater;