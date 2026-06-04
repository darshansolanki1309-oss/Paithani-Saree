import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

// 1. Import the Clerk provider
import { ClerkProvider } from '@clerk/clerk-react';

// 2. Get your publishable key from the .env file
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      
      {/* Remove basename from here */}
      <BrowserRouter>
        <App />
      </BrowserRouter>

    </ClerkProvider>
  </React.StrictMode>,
);