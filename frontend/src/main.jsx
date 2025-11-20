import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setupConsoleForwarding } from './utils/consoleForwarder';

// Setup browser console forwarding to backend (for Claude Code debugging)
setupConsoleForwarding();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
