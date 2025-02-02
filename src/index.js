import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Import your main App component
import './index.css';  // Optional for global styles

// Create a root element to render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);