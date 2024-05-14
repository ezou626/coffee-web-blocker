# Coffee Web Blocker Chrome Extension (React, TypeScript, Webpack, Chrome API)

## Product Landing Page

## Our Awesome Features

- Users can create customizable lists of websites to block
- Users can activate groups of list to block in the same blocking session
- Users can temporarily bypass the blocking of a website during a session if needed
- Users add specific URL or the whole domain to a blocklist
- Users can easily create, update, and delete their blocklists via the advanced settings page

## Implementation Details

### Storage
- IndexedDB
- Local Storage

### Monitoring
- Service Worker

## Installation

### Install From Release

- Download the latest release from the [Releases](https://github.com/ezou626/coffee-web-blocker/releases)
- Unzip the downloaded ZIP file
- Open Chrome and navigate to `chrome://extensions`
- Enable "Developer mode"
- Drag and drop the unzipped folder into the extensions page

### Install From Source

1. Clone the repository:

   ```bash
   git clone https://github.com/ezou626/coffee-web-blocker/releases
   ```

2. Install dependencies:

   ```bash
   cd coffee-web-blocker
   yarn install
   ```

3. Build the extension:

   ```bash
   yarn run build
   ```

4. Load the extension in Chrome:

   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory from the project

## Demo Instruction

- Navigate to a new tab

### Popup Demo
- Click on the extension icon to open the popup window
- Insert Screenshot Here
- Under "Start A New Session" in the popup, you can start a new session by selecting one or more list from the Search Lists dropdown and clicking on block.
- Once a blocking session start, you can easily end the session by clicking on "End Blocking Session" button.
- Under "Add Current Tab To List", the URL of the active tab is displayed. You can add this URL or the domain of this URL to a list chosen from the dropdown.

### Setting Page Demo
- Click on "Advanced Settings" to open the setting page.
- On the setting page, you can easily create a new block lists, or delete existing block lists by clicking the 'x' next to each of them.
- Clicking on each individual list would bring you to their respective editing page.
- In the editing page, you can add URL and domain to that list, as well as view all existing URL/domains in that list and deleting them as needed.

### Blocking Demo
- Once a blocking session start, all URL and domains in the selected lists for that session will be blocked
- You can temporarily bypass blocking by clicking "Unblock for Now"


## Development

- Run the development server with hot reloading:

  ```bash
  yarn run dev
  ```

- Load the unpacked extension in Chrome from the `dev_dist` directory
- Make changes to the source code and the extension will automatically reload

## Chrome Extension Architecture

This project follows the Manifest V3 architecture for Chrome extensions. Key components of the architecture include:

- `manifest.json`: Defines the extension's metadata, permissions, and script configurations
- `background.js`: Runs in the background and handles events and long-running tasks
- `contentScript.js`: Injected into web pages to interact with the DOM and communicate with the background script
- Popup window: Displays the extension's user interface when the extension icon is clicked
- Advanced Settings Page: Displays editing and updating features of blocklists

### Manifest V3

This extension is built using the latest version of the Chrome extension manifest (Manifest V3). The `manifest.json` file defines the extension's properties, permissions, and scripts.

Key aspects of the Manifest V3 configuration include:

- `manifest_version`: Set to `3` to use Manifest V3
- `background`: Specifies the background script as a service worker
- `action`: Defines the popup HTML file
- `permissions`: Declares the required permissions for the extension (storage, activeTab, contextMenus)
- `content_scripts`: Specifies the content script to be injected into web pages

## Project Architecture

The project follows a modular architecture with separation of concerns:
- `Popup.tsx`: The React component for the popup
- `Page.tsx`: The React component for the page
- `index.tsx`: The entry point for the popup
- `page_index.tsx`: The entry point for the page

The communication between the extension's scripts is handled as follows:

- `contentScript.js`: Injected into web pages, captures selected text and sends a message to the background script
- `background.js`: Listens for messages from the content script, saves snippets to storage, and manages the context menu

## Credits

The initial setup of this project was based on the tutorial by [Harshita Joshi](https://github.com/Harshita-mindfire) on creating a Chrome extension with React and TypeScript. The corresponding Medium article can be found [here](https://medium.com/@tharshita13/creating-a-chrome-extension-with-react-a-step-by-step-guide-47fe9bab24a1).

The project has been extended with additional functionality, testing setup, and documentation by Professor Lumbroso. The most difficult part was figuring out the right combination of packages for the testing suite (for instance, I would avoid `jest-chrome`, `mockzilla`, `mockzilla-webextension`, to name but a few).

Our project forked Professor Lumbroso's repository as a base, changing to ECMAScript 6.
