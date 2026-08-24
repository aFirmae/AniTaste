import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import AnimeDetailsPage from './pages/AnimeDetailsPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
            <Route path="anime/:id" element={<AnimeDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
