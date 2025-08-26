import "./App.css";
import { useAuth } from "react-oidc-context";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PollDetail from './pages/PollDetail';
import { motion } from 'framer-motion';

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-light">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Always show the polling interface - no authentication required for viewing/voting
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/poll/:id" element={<PollDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
