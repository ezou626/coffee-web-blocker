/**
 * This component is designed to add the active tab URL to a specified block list
 */

import { useState, useEffect } from "react";

const BlockListUpdater = () => {
  const [currentTabUrl, setCurrentTabUrl] = useState<string | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'getCurrentTab' }, (response) => {
        setCurrentTabUrl(response.tabUrl);
    });
  }, []);

  return (
  <div>
    <h1>Current Tab URL:</h1>
    {currentTabUrl && <p>{currentTabUrl}</p>}
    <button>Add URL to List</button>
  </div>
  );
}

export default BlockListUpdater;