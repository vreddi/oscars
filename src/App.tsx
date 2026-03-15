import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LobbyPage } from './pages/LobbyPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { LivePage } from './pages/LivePage';
import { ResultsPage } from './pages/ResultsPage';
import { AdminPage } from './pages/AdminPage';
import { prefetchAllImages } from './utils/tmdb';
import { categories } from './data/categories';

function App() {
  // Prefetch all TMDB images on app load so they're cached for the ceremony
  useEffect(() => {
    prefetchAllImages(categories);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lobby/:gameCode" element={<LobbyPage />} />
      <Route path="/predict/:gameCode" element={<PredictionsPage />} />
      <Route path="/live/:gameCode" element={<LivePage />} />
      <Route path="/results/:gameCode" element={<ResultsPage />} />
      <Route path="/admin/:gameCode" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
