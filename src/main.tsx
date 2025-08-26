
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AuthProvider from './components/providers/AuthProvider.tsx';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PollDetail from './pages/PollDetail';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poll/:id" element={<PollDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
