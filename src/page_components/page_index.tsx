import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Page from './AdvancedSettings';
import '../globals.css';

const root = document.getElementById("root")!;
const rootDiv = createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);
