import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import './globals.css';

const root = document.getElementById("root")!;
const rootDiv = createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
