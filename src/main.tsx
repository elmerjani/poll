
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AuthProvider from './components/providers/AuthProvider.tsx';
import { WebSocketProvider } from './contexts/WebSocketContext.tsx';
import App from './App.tsx';
import './index.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
 
        <App />

    </AuthProvider>
  </StrictMode>
);
