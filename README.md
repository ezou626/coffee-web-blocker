# LockIn Chrome Extension (React, TypeScript, Webpack)

## Features

- Dynamic block list
- Timed/Untimed blocking

## Implementation Details

### Storage


### Monitoring
background.js to register actions taken when a new tab is opened
- read link and evaluate if should be blocked

## Installation

### Install From Release

- Download the latest release from the [Releases](https://github.com/jlumbroso/chrome-extension-text-collector/releases)
- Unzip the downloaded ZIP file
- Open Chrome and navigate to `chrome://extensions`
- Enable "Developer mode"
- Drag and drop the unzipped folder into the extensions page

### Install From Source

1. Clone the repository:

   ```bash
   git clone https://github.com/ezou626/lockin-chrome-extension-demo
   ```

2. Install dependencies:

   ```bash
   cd lockin-chrome-extension-demo
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

## Usage

- Right-click on a web page and select "Capture Snippet" from the context menu to save the selected text as a snippet
- Click on the extension icon to open the popup window
- In the popup, you can view, edit, and delete saved snippets

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

## Testing

The project includes a comprehensive testing setup using Jest, Sinon, and sinon-chrome. The tests cover various aspects of the extension, including component rendering, user interactions, and mocking of Chrome APIs.

To run the tests:

```bash
yarn run test
```

To generate a coverage report:

```bash
yarn run coverage
```

### Mocking Chrome APIs

One of the key aspects of testing a Chrome extension is mocking the Chrome APIs. This project uses the following libraries to achieve this:

- [Jest](https://jestjs.io/): The test runner and assertion library
- [Sinon](https://sinonjs.org/): A library for creating spies, stubs, and mocks
- [sinon-chrome](https://github.com/acvetkov/sinon-chrome/): A collection of pre-built mocks for Chrome APIs
- [jest-sinon](https://github.com/djkf/jest-sinon): An extension for Jest to work seamlessly with Sinon

Here's an example test that demonstrates mocking the Chrome storage API:

```typescript
it('sets initial state with empty array when snippets key is an empty array in local storage', async () => {
  chrome.storage.local.get.withArgs('snippets').yields({ snippets: [] });

  render(<App />);
  const snippetElements = screen.queryAllByRole('listitem');
  expect(snippetElements).toHaveLength(0);
});
```

In this test, we mock the `chrome.storage.local.get` method to return an empty array for the 'snippets' key. This allows us to test how the `App` component behaves when there are no saved snippets.

## Credits

The initial setup of this project was based on the tutorial by [Harshita Joshi](https://github.com/Harshita-mindfire) on creating a Chrome extension with React and TypeScript. The corresponding Medium article can be found [here](https://medium.com/@tharshita13/creating-a-chrome-extension-with-react-a-step-by-step-guide-47fe9bab24a1).

The project has been extended with additional functionality, testing setup, and documentation by Professor Lumbroso. The most difficult part was figuring out the right combination of packages for the testing suite (for instance, I would avoid `jest-chrome`, `mockzilla`, `mockzilla-webextension`, to name but a few).
