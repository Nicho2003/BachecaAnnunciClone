/**
 * @file main.jsx
 * @description Main entry point for the React application.
 * Sets up the root component, providers (like AuthProvider and BrowserRouter), and global styles.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.js';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Global Bootstrap CSS

// Get the root DOM element
const rootElement = document.getElementById('root');

// Create a root for React rendering
const root = createRoot(rootElement);

// Render the application
root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
